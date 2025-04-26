import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { UserDto } from 'src/users/dto/user.dto';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'John' })
  firstname: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'Doe' })
  lastname: string;

  @IsOptional()
  @IsPhoneNumber('NG') // or general format
  @ApiProperty({ example: '+2341234567890', required: false })
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'password123', minLength: 6, description: 'Minimum length is 6 characters' })
  password: string;

  @IsOptional()
  @ApiProperty({ example: 'renter', required: false })
  role: Role | undefined;

  @IsOptional()
  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatarUrl?: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'password123', minLength: 6, description: 'Minimum length is 6 characters' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'token' })
  access_token: string;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'verification-token' })
  token: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'verification-token' })
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'newpassword123', minLength: 6, description: 'Minimum length is 6 characters' })
  password: string;
}