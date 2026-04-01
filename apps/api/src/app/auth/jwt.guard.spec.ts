import { UnauthorizedException } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import * as jwt from 'jsonwebtoken';

describe('JwtGuard', () => {
  const jwtSecret = 'test-secret';
  const authService = {
    isTokenRevoked: jest.fn(() => false),
    getJwtSecret: jest.fn(() => jwtSecret),
  };
  const guard = new JwtGuard(authService as any);

  const createContext = (token?: string) => {
    const request: any = { headers: token ? { authorization: `Bearer ${token}` } : {} };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
  };

  it('allows a valid token', () => {
    const validToken = jwt.sign({ sub: 1, email: 'x@x.com', roles: ['user'] }, jwtSecret, { expiresIn: '1h' });
    const context = createContext(validToken);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
    expect(context.switchToHttp().getRequest().user).toBeTruthy();
  });

  it('throws for missing authorization header', () => {
    expect(() => guard.canActivate(createContext())).toThrow(UnauthorizedException);
  });

  it('throws for revoked token', () => {
    (authService.isTokenRevoked as jest.Mock).mockReturnValueOnce(true);
    const revokedToken = jwt.sign({ sub: 1 }, jwtSecret, { expiresIn: '1h' });
    expect(() => guard.canActivate(createContext(revokedToken))).toThrow(UnauthorizedException);
  });

  it('throws for invalid token', () => {
    expect(() => guard.canActivate(createContext('invalid.token'))).toThrow(UnauthorizedException);
  });
});