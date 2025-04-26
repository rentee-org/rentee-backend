import { Role } from 'src/common/enums/role.enum';


export class UserDto {
  id: string;
  firstname: string;
  lastname: string;
  username?: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  addressLine1?: string;
  status?: string;
  city?: string;
  state?: string;
  country?: string;
  isEmailVerified?: boolean;
  authProvider?: 'local' | 'google' | 'facebook';
  lastLogin?: Date;
  createdAt?: Date;
}
