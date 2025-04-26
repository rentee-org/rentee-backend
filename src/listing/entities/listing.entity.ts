import { BaseEntity } from 'src/config/base.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('listings')
export class Listing extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id: number;
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 'available' }) // available | rented | inactive
  status: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

}
