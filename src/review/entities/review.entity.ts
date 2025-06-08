import { BaseEntity } from "src/config/base.entity";
import { Listing } from "src/listing/entities/listing.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, Column } from "typeorm";

@Entity('reviews')
export class Review extends BaseEntity {
    @ManyToOne(() => User, user => user.reviews)
    renter: User;

    @ManyToOne(() => Listing, listing => listing.reviews)
    listing: Listing;

    @Column({ type: 'int' })
    rating: number;

    @Column('text')
    comment: string;
}
