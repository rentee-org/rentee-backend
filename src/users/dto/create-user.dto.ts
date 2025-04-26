import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 100)
  firstname: string;

  @IsNotEmpty()
  @Length(2, 100)
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  phone?: string;
  password: string;
  role: Role;
  avatarUrl?: string;

  status?: string;
  city?: string;
  state?: string;
  country?: string;
  isEmailVerified?: boolean;
  authProvider?: 'local' | 'google' | 'facebook';
}


