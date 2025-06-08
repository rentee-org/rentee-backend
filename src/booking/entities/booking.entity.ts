import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';
import { User } from 'src/users/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { BaseEntity } from 'src/config/base.entity';
import { BookingStatus } from 'src/common/enums/booking.enum';
    
@Entity('bookings')
export class Booking extends BaseEntity {
    @ManyToOne(() => Listing, listing => listing.bookings)
  listing: Listing;

  @ManyToOne(() => User, user => user.bookings)
  renter: User;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @OneToOne(() => Payment, payment => payment.booking)
  payment: Payment;
}
