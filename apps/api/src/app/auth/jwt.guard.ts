import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (this.authService.isTokenRevoked(token)) {
      throw new UnauthorizedException('Token revoked');
    }

    try {
      const payload = jwt.verify(token, this.authService.getJwtSecret());
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
