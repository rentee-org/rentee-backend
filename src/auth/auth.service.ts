import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { LoginDto, LoginResponseDto, RegisterDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { CustomApiResponse } from 'src/common/dto/response.dto';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService
  ) {}

  async register(model: RegisterDto): Promise<CustomApiResponse<string>> {
    
    const exists = await this.userService.findByEmail(model.email);
    console.log('existing user:', JSON.stringify(exists));
      
    if (exists) throw new BadRequestException('Email already registered');

    const hashedPassword = await this.hashPassword(model.password);
    const user = await this.userService.create({
      ...model,
      isEmailVerified: false,
      authProvider: 'local',
      password: hashedPassword,
    });

    let response = new CustomApiResponse<string>();
    response.message = 'User registered successfully!';
    response.success = true;
    response.data = 'User registered successfully!';

    // Log the registration event
    await this.auditService.logEvent({
      action: 'User Registration',
      userId: user.id,
      details: `User ${user.email} registered successfully`,
      entity: 'Registration',
      ipAddress: ''
    });

    return response;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    // const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(model: LoginDto): Promise<CustomApiResponse<LoginResponseDto>> {
    const user = await this.validateUser(model.email, model.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    
    // Add claims to the payload without `exp`
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        // Add custom claims as needed
        firstName: user.firstname,
        lastName: user.lastname,
        isActive: user.isActive,
        iat: Math.floor(Date.now() / 1000), // Issued at
        // Note: `exp` is not included here, it will be set by the `expiresIn` option
        
    };

    // Generate JWT with `expiresIn` option
    const token = await this.generateJwt(payload);
    
    // Exclude the password from the user object
    const { password, ...safeUser } = user;

    // Update the last login time
    await this.userService.updateUserLastLogin(user);

    // Return the token and user information
    let response = new CustomApiResponse<LoginResponseDto>();
    response.message = 'User logged in successfully!';
    response.success = true;
    response.data = { access_token: token, user: safeUser as UserDto };

    // Log the login event
    await this.auditService.logEvent({
        action: 'User Login',
        userId: user.id,
        details: `User ${user.email} logged in successfully`,
        entity: 'Login',
        ipAddress: '', // You can add logic to capture the IP address if needed
    });

    return response;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async generateJwt(payload: object): Promise<string> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const exp_time = this.configService.get<string>('JWT_EXPIRATION');

    // Validate and format `expiresIn`
    let expiresIn: string | number;
    if (!isNaN(Number(exp_time))) {
        expiresIn = Number(exp_time); // Use as a number if it's numeric
    } else if (typeof exp_time === 'string' && /^[0-9]+[smhd]$/.test(exp_time)) {
        expiresIn = exp_time; // Use as a string if it matches the expected format
    } else {
        console.error(`Invalid JWT_EXPIRATION_TIME: ${exp_time}`);
        console.error(`JWT secret: ${jwtSecret}`);
        throw new Error('Invalid JWT_EXPIRATION_TIME format. It must be a number (seconds) or a string (e.g., "1d", "20h", "60s").');
    }

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = 
    await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn, // Use the validated `expiresIn` value
    });
    if (!token) {
      throw new Error('Failed to generate JWT token');
    }
  
    return token;
  }
}
