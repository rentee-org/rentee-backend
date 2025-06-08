import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from 'src/listing/entities/listing.entity';
import { Booking } from './entities/booking.entity';
import { NotificationService } from 'src/common/notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Listing])
  ],
  controllers: [BookingController],
  providers: [BookingService, NotificationService],
})
export class BookingModule { }
