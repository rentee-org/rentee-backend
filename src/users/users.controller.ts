import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  NotImplementedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  // This endpoint requires authentication but no specific role
  @Post('change-password') 
  async changePassword(@Body() changePasswordDto: any) {
    // return this.authService.changePassword(changePasswordDto);
    throw new NotImplementedException('Not implemented yet');
  }

  @Put('me')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, dto);
  }

  @Roles(Role.ADMIN)
  @Get('users')
  async getAllUsers() {
    return this.userService.findAll();
  }
  

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
