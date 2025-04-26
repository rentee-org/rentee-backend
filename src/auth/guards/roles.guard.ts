import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // Ensure user object exists and has roles
    if (!user || !user.roles) {
      throw new ForbiddenException('User has no roles assigned');
    }
    
    
    // return requiredRoles.includes(user.role);
    // Check if the user has at least one of the required roles
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
