// booking.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BookingStatus } from 'src/common/enums/booking.enum';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Listing } from 'src/listing/entities/listing.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationService } from 'src/common/notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Listing)
    private listingRepo: Repository<Listing>,

    private notificationService: NotificationService
  ) { }

  /**
   * Creates a new booking for a listing.
   * @param dto - The data transfer object containing booking details.
   * @param renter - The user who is renting the listing.
   * @returns The created booking.
   */
  async create(dto: CreateBookingDto, renter: User): Promise<Booking> {
    const listing = await this.listingRepo.findOne({
      where: { id: dto.listingId },
      relations: ['owner'],
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (!listing.isAvailable) throw new BadRequestException('Listing is not available');

    // Check for overlapping bookings
    const overlaps = await this.bookingRepo.findOne({
      where: {
        listing: { id: dto.listingId },
        startDate: Between(dto.startDate, dto.endDate),
      },
    });

    if (overlaps) throw new BadRequestException('Listing is already booked during this period');

    // Calculate number of days
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (days < 1) throw new BadRequestException('End date must be after start date');

    const totalPrice = Number(listing.pricePerDay) * days;

    const booking = this.bookingRepo.create({
      listing,
      renter,  // Ensure renter is set
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalPrice,
      status: BookingStatus.PENDING,
    });

    // save booking
    await this.bookingRepo.save(booking);

    // Update listing availability
    listing.isAvailable = false;
    await this.listingRepo.save(listing);

    // Optionally, you can send a notification to the owner of the listing
    await this.notificationService.sendBookingNotification(listing.owner.email, booking);

    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: ['listing', 'renter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['listing', 'renter'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { renter: { id: userId } },
      relations: ['listing', 'renter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByListing(listingId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { listing: { id: listingId } },
      relations: ['listing', 'renter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { status },
      relations: ['listing', 'renter'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, dto);
    return this.bookingRepo.save(booking);
  }

  async remove(id: string): Promise<void> {
    await this.bookingRepo.softDelete(id);
  }
}
