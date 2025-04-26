import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing } from './entities/listing.entity';
import { FilterListingDto } from './dto/filter-listing.dto';

@Injectable()
export class ListingService {
  constructor(@InjectRepository(Listing) private repo: Repository<Listing>) {}

  async create(dto: CreateListingDto, ownerId: string): Promise<Listing> {
    const listing = this.repo.create({ ...dto, owner: { id: ownerId } });
    return await this.repo.save(listing);
  }

  async findAll(): Promise<Listing[]> {
    return this.repo.find({ relations: ['owner'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.repo.findOne({ where: { id }, relations: ['owner'] });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findFiltered(query: FilterListingDto) {
    const { search, category, status, page = 1, limit = 10 } = query;
  
    const qb = this.repo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.owner', 'owner')
      .where('listing.status != :deleted', { deleted: 'deleted' })
      .andWhere('listing.isArchived = false');

  
    if (search) {
      qb.andWhere('(listing.title ILIKE :search OR listing.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }
  
    if (category) {
      qb.andWhere('listing.category = :category', { category });
    }
  
    if (status) {
      qb.andWhere('listing.status = :status', { status });
    }
  
    qb.skip((+page - 1) * +limit).take(+limit);
  
    const [items, totalItems] = await qb.getManyAndCount();
  
    return {
      currentPage: +page,
      totalPages: Math.ceil(totalItems / +limit),
      totalItems,
      items,
    };
  }
  

  async update(id: string, dto: UpdateListingDto): Promise<Listing> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const listing = await this.findOne(id);
    listing.status = 'inactive';
    listing.isArchived = true;
    await this.repo.save(listing);
    return { message: 'Listing archived successfully' };
  }
  
}
