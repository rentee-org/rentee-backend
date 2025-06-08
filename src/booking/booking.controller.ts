import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { BookingStatus } from 'src/common/enums/booking.enum';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Create a new booking.
   * @param createBookingDto - The data for creating a booking.
   * @returns The created booking.
   */
  // Note: The create method should ideally accept a user context to associate the booking with the user.
  // This can be done using guards or interceptors to extract the user from the request.
  // For simplicity, this example does not include user context handling.
  // In a real application, you would typically use a guard to extract the user from the request.
  // For example:
  // @UseGuards(AuthGuard())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: Request) {
    const user = req.user as User;
    return this.bookingService.create(dto, user);
  }

  /**
   * Get all bookings.
   * @returns An array of all bookings.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  /**
   * Get a booking by ID.
   * @param id - The ID of the booking to retrieve.
   * @returns The booking with the specified ID.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  /**
   * Get all bookings for a specific user.
   * @param userId - The ID of the user to retrieve bookings for.
   * @returns An array of bookings for the specified user.
   */
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(userId);
  }

  /**
   * Get all bookings for a specific listing.
   * @param listingId - The ID of the listing to retrieve bookings for.
   * @returns An array of bookings for the specified listing.
   */
  @UseGuards(JwtAuthGuard)
  @Get('listing/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.bookingService.findByListing(listingId);
  }

  /**
   * Get all bookings with a specific status.
   * @param status - The status of the bookings to retrieve.
   * @returns An array of bookings with the specified status.
   */
  @UseGuards(JwtAuthGuard)
  @Get('status/:status')
  findByStatus(@Param('status') status: BookingStatus) {
    return this.bookingService.findByStatus(status);
  }

  /**
   * Update a booking by ID.
   * @param id - The ID of the booking to update.
   * @param updateBookingDto - The data to update the booking with.
   * @returns The updated booking.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  /**
   * Delete a booking by ID.
   * @param id - The ID of the booking to delete.
   * @returns A confirmation message or the deleted booking.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
