import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  // @PrimaryColumn()
  // id!: string;

  // @BeforeInsert()
  // // Generate a shorter ID (default nanoid is 21 chars)
  // async generateId() {
  //   this.id = nanoid(10); // You can specify your desired length
  // }
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date;
}
