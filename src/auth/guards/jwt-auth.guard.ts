// src/auth/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access
    if (isPublic) {
      return true;
    }

    // Otherwise, use the JWT authentication
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // Handle any errors from the authentication process
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }

    // Attach the userId, email, firstname and lastname to the request object
    if (!user.sub || !user.email || !user.firstname || !user.lastname) {
      throw new UnauthorizedException('Invalid user data');
    }
    // Assuming user.sub is the user ID, and user.email, firstname, lastname are available
    if (!user.firstname || !user.lastname) {
      throw new UnauthorizedException('User firstname or lastname is missing');
    }
    if (!user.email) {
      throw new UnauthorizedException('User email is missing');
    }
    if (!user.role) {
      throw new UnauthorizedException('User role is missing');
    }
    
    // Attach user data to the request object
    const request: Request = context.switchToHttp().getRequest();
    request.user = { ...user, userId: user.sub, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role };
    // Optionally, you can log the user data or perform additional checks here
    console.log('Authenticated user:', request.user);
    return user;
  }
}