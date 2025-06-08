import { AuditInterceptor } from './audit.interceptor';
import { AuditService } from '../../../audit/audit.service';
import { Reflector } from '@nestjs/core';

describe('AuditInterceptor', () => {
  it('should be defined', () => {
    const mockAuditService = {} as AuditService;
    const mockReflector = {} as Reflector;
    expect(new AuditInterceptor(mockAuditService, mockReflector)).toBeDefined();
  });
});
