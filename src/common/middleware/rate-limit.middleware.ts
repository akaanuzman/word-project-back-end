import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs = 5 * 60 * 1000; // 5 minutes
  private readonly maxRequests = 100; // 100 requests per window

  use(req: Request, res: Response, next: NextFunction) {
    const key = this.getClientKey(req);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup();

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      if (now > this.store[key].resetTime) {
        // Reset window
        this.store[key] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
      } else {
        this.store[key].count++;
      }
    }

    if (this.store[key].count > this.maxRequests) {
      throw new HttpException(
        'Too many requests from this IP, please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader(
      'X-RateLimit-Remaining',
      this.maxRequests - this.store[key].count,
    );
    res.setHeader(
      'X-RateLimit-Reset',
      new Date(this.store[key].resetTime).toISOString(),
    );

    next();
  }

  private getClientKey(req: Request): string {
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}
