import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { Listing } from './entities/listing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from 'src/common/services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  controllers: [ListingController],
  providers: [ListingService, UploadService],
  exports: [ListingService],
})
export class ListingModule {}
