import { Booking } from "src/booking/entities/booking.entity";
import { BaseEntity } from "src/config/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity('payments')
export class Payment extends BaseEntity {
    @OneToOne(() => Booking, booking => booking.payment)
    @JoinColumn()
    booking: Booking;

    @Column('decimal')
    amount: number;

    @Column()
    status: 'pending' | 'paid' | 'failed' | 'refunded';

    @Column()
    provider: 'paystack' | 'stripe' | 'flutterwave';

    @Column()
    transactionRef: string;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;
}
