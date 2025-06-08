import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../common/enums/booking.enum';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
