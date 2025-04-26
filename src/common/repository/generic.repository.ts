import { Repository, FindOptionsWhere } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from 'src/config/base.entity';
import { IGenericRepository } from '../interfaces/generic.repository';

export class GenericRepository<T extends BaseEntity> implements IGenericRepository<T> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly relations: string[] = []
  ) {}

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations: this.relations
    });
    if (!entity) throw new NotFoundException(`Entity with id ${id} not found`);
    return entity;
  }

  async create(item: T): Promise<T> {
    const entity = this.repository.create(item);
    return await this.repository.save(entity);
  }

  async createMany(items: T[]): Promise<T[]> {
    const entities = this.repository.create(items);
    return await this.repository.save(entities);
  }

  async update(id: string, item: T): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) throw new NotFoundException(`Entity with id ${id} not found`);
    // Merge the existing entity with the new data
    const updatedEntity = this.repository.merge(entity, item);
    return await this.repository.save(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations: this.relations
    });
    if (!entity) throw new NotFoundException(`Entity with id ${id} not found`);
    return entity;
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find({
      relations: this.relations,
      order: { createdAt: 'DESC' } as any
    });
  }

  async findWithFilters(filters: any): Promise<{
    items: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { search, page = 1, limit = 10, ...otherFilters } = filters;
    
    const qb = this.repository.createQueryBuilder('entity');
    
    // Add relations
    this.relations.forEach(relation => {
      qb.leftJoinAndSelect(`entity.${relation}`, relation);
    });

    // Add search if searchable fields are provided
    if (search && filters.searchableFields) {
      const searchConditions = filters.searchableFields.map(
        field => `entity.${field} ILIKE :search`
      );
      qb.andWhere(`(${searchConditions.join(' OR ')})`, {
        search: `%${search}%`,
      });
    }

    // Add other filters
    Object.keys(otherFilters).forEach(key => {
      if (otherFilters[key] !== undefined && !key.includes('searchableFields')) {
        qb.andWhere(`entity.${key} = :${key}`, { [key]: otherFilters[key] });
      }
    });

    // Add pagination
    qb.skip((+page - 1) * +limit).take(+limit);

    const [items, totalItems] = await qb.getManyAndCount();

    return {
      items,
      totalItems,
      currentPage: +page,
      totalPages: Math.ceil(totalItems / +limit),
    };
  }
}