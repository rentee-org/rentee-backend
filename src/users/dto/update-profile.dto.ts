import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsOptional()
  @MinLength(3)
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('NG')
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
