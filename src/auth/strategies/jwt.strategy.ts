import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    // Find the user in the database to get their up-to-date roles
    const user = await this.userService.findById(payload.sub);

    // Return user information with roles to be attached to the request
    return {
      userId: payload.sub,
      username: payload.username,
      firstname: payload.firstname,
      lastname: payload.lastname,
      phone: payload.phone,
      email: payload.email,
      roles: user.role,
    };
  }
}
