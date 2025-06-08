import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Attach the resolved IP to a custom property
    (req as any).clientIp = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    next();
  }
}
// This middleware sets the IP address of the request in req.ip