import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [
    TypeOrmModule.forFeature([User]),
    UsersService, // Export UsersService
  ], // Export UserRepository
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
