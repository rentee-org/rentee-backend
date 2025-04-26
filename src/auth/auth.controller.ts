import { Controller, Post, Body, UseGuards, Request, NotImplementedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: ApiResponse,
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: ApiResponse,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // This endpoint requires authentication but no specific role
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: ApiResponse,
  })
  async changePassword(@Body() changePasswordDto: any) {
    // return this.authService.changePassword(changePasswordDto);
    throw new NotImplementedException('Not implemented yet');
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ApiResponse,
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
