import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const user = request.user;
    const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
    const method = request.method;
    const url = request.url;
    const body = request.body;

    // check if request is loging and obsfucate sensitive data
    const isLoggingDisabled = this.reflector.get<boolean>(
      'disableAuditLogging',
      context.getHandler(),
    );
    if (isLoggingDisabled) {
      return next.handle();
    }
    

    return next.handle().pipe(
      tap(async (response) => {
        // Only log if it's a mutation
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          await this.auditService.log({
            action: `${method} ${url}`,
            userId: user?.id,
            entity: context.getClass().name,
            newValue: body,
            ipAddress: ip,
          });
        }
      }),
    );
  }
}
