import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDto } from './dto/user.dto';
import { CustomApiResponse } from 'src/common/dto/response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getProfile(userId: string): Promise<UserDto | null> {
    console.log('Fetching profile for userId:', userId);
    return this.usersRepository.findOne({
      where: { id: userId.toString() },
      select: [
        'id',
        'firstname',
        'lastname',
        'username',
        'email',
        'phone',
        'avatarUrl',
        'role',
        'city',
        'state',
        'country',
        'createdAt',
      ],
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      await this.usersRepository.update(userId, dto);
      return { message: 'Profile updated successfully' };
    }
    catch (error) {
      throw new Error('User not found');
    }
  }

  findAll(): Promise<UserDto[]> {
    var users = this.usersRepository.find();

    if (!users) {
      throw new Error('No users found');
    }

    // Exclude sensitive information like password
    // return user dtos instead of user entities
    let userDto = users.then(users =>
      users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser as UserDto;
      })
    );

    return userDto;
  }

  findOne(id: string): Promise<UserDto | null> {
    let user = this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    // Exclude sensitive information like password and return user dto

    let userDto = user.then(user => {
      const { password, ...safeUser } = user;
      return safeUser as UserDto;
    });
    return userDto;
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if the user already exists
      const existingUser = this.usersRepository.findOne({ where: { email: createUserDto.email } });
      console.log('existing user:', JSON.stringify(existingUser));
      if (!existingUser) throw new Error('User already exists');
      
      if (!createUserDto) throw new Error('Invalid user data');
      const user = this.usersRepository.create(createUserDto);
      return this.usersRepository.save(user);
    }
    catch (error) {
      throw new Error('User already exists');
    }
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<CustomApiResponse<UpdateUserDto>> {
    try {
      const user = this.usersRepository.findOne({ where: { id } });
      if (!user) throw new Error('User not found');
      const user_obj = this.usersRepository.update(id, updateUserDto);

      // const { password, ...safeUser } = user;
    // Return the token and user information
    let response = new CustomApiResponse<UpdateUserDto>();
    response.success = true;
    response.message = 'User updated successfully!';
    response.data = updateUserDto as UpdateUserDto;
    return Promise.resolve(response);
    }
    catch (error) {
      throw new Error('User not found');
    }
  }

  async updateUserLastLogin(user: User): Promise<void> {
    try {
      if (!user) throw new Error('User not found');
      user.lastLogin = new Date();
      await this.usersRepository.save(user);
    }
    catch (error) {
      throw new Error('User not found');
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
