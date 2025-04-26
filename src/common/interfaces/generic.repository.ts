import { BaseEntity } from "src/config/base.entity";

export interface IGenericRepository<T extends BaseEntity> {
    create(item: Partial<T>): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
    findOne(id: string): Promise<T>;
    findAll(): Promise<T[]>;
    findWithFilters(filters: any): Promise<{ items: T[]; totalItems: number; currentPage: number; totalPages: number }>;
  }