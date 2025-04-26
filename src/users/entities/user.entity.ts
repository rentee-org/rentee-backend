import { Role } from 'src/common/enums/role.enum';
import { BaseEntity } from 'src/config/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column({ length: 100, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100, default: 'renter' }) // renter, owner or admin
  role: Role;

  @Column({ length: 150, nullable: true })
  addressLine1: string;

  @Column({ length: 100, nullable: true })
  status: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: 'local' })
  authProvider: 'local' | 'google' | 'facebook';

  @Column({ nullable: true })
  lastLogin?: Date;
}
