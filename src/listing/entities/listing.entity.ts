import { Booking } from 'src/booking/entities/booking.entity';
import { BaseEntity } from 'src/config/base.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('listings')
export class Listing extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal')
  pricePerDay: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ default: 'available' }) // available | rented | inactive
  status: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column()
  location: string;

  @Column({ default: true })
  isAvailable: boolean;

  // @ManyToOne(() => User, (user) => user.id)
  // owner: User;

  @ManyToOne(() => User, user => user.listings)
  owner: User;

  @OneToMany(() => Booking, booking => booking.listing)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.listing)
  reviews: Review[];
}
