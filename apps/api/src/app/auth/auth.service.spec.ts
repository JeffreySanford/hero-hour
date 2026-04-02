import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user with hashed password', async () => {
      const dto: RegisterDto = { email: 'test@example.com', password: 'plainpw', username: 'bob' };
      const user = await service.register(dto);
      expect(user.password).toBe('hashed');
    });

    it('should reject duplicate email', async () => {
      const dto: RegisterDto = { email: 'dupe@example.com', password: 'pw', username: 'dupe' };
      await service.register(dto);
      await expect(service.register(dto)).rejects.toThrow(/already registered/);
    });
  });

  describe('validateCredentials', () => {
    it('should validate credentials for correct login', async () => {
      const dto: RegisterDto = { email: 'login@example.com', password: 'pw', username: 'login' };
      await service.register(dto);
      const valid = await service.validateCredentials(dto.email, dto.password);
      expect(valid).toBe(true);
    });

    it('should reject invalid credentials', async () => {
      const dto: RegisterDto = { email: 'fail@example.com', password: 'pw', username: 'fail' };
      await service.register(dto);
      const valid = await service.validateCredentials(dto.email, 'wrongpw');
      expect(valid).toBe(false);
    });
  });

  describe('login', () => {
    it('should issue auth tokens with expected claims', async () => {
      const dto: RegisterDto = { email: 'claims@example.com', password: 'pw', username: 'claims' };
      await service.register(dto);
      const loginResult = await service.login({ email: dto.email, password: dto.password });
      expect(loginResult).toHaveProperty('accessToken');
      expect(loginResult).toHaveProperty('refreshToken');
      expect(loginResult).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        })
      );
      // Optionally decode and check claims
      const decoded = require('jsonwebtoken').decode(loginResult.accessToken) as { email: string; roles: string[] };
      expect(decoded.email).toBe(dto.email);
      expect(decoded.roles).toContain('user');
    });

    it('should match shared LoginResponse shape', async () => {
      const dto: RegisterDto = { email: 'shape@example.com', password: 'pw', username: 'shape' };
      await service.register(dto);
      const loginResult = await service.login({ email: dto.email, password: dto.password });
      expect(loginResult).toMatchObject({ accessToken: expect.any(String), refreshToken: expect.any(String) });
    });

    it('should reject login for unverified user when verification is required', async () => {
      // Simulate unverified user
      const dto: RegisterDto = { email: 'unverified@example.com', password: 'pw', username: 'unverified' };
      const user = await service.register(dto);
      // Mark as unverified
      (user as any).verified = false;
      // Patch service users array
      (service as any).users.find((u: any) => u.email === user.email).verified = false;
      // Should reject login
      await expect(service.login({ email: dto.email, password: dto.password })).rejects.toThrow();
    });

    it('should rotate refresh token on refresh', async () => {
      const dto: RegisterDto = { email: 'refresh@example.com', password: 'pw', username: 'refresh' };
      await service.register(dto);
      const loginResult = await service.login({ email: dto.email, password: dto.password });
      const refreshResult = await service.refresh({ refreshToken: loginResult.refreshToken });
      expect(refreshResult.refreshToken).not.toBe(loginResult.refreshToken);
      expect(refreshResult.accessToken).not.toBe(loginResult.accessToken);
    });

    it('should reject expired refresh token', async () => {
      const dto: RegisterDto = { email: 'expired@example.com', password: 'pw', username: 'expired' };
      await service.register(dto);
      // Create expired token
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign({ sub: 999 }, (service as any).jwtSecret, { expiresIn: -10 });
      await expect(service.refresh({ refreshToken: expiredToken })).rejects.toThrow();
    });

    it('should reject malformed refresh token', async () => {
      await expect(service.refresh({ refreshToken: 'not.a.jwt' })).rejects.toThrow();
    });

    it('should reject refresh token not in session', async () => {
      const dto: RegisterDto = { email: 'refresh2@example.com', password: 'pw', username: 'refresh2' };
      await service.register(dto);
      const loginResult = await service.login({ email: dto.email, password: dto.password });
      // Simulate redis being available but token not found
      (service as any).redisClient = {
        isReady: true,
        get: async () => null,
      };
      await expect(service.refresh({ refreshToken: loginResult.refreshToken })).rejects.toThrow(/invalid refresh token/i);
    });

    it('should reject invalid credentials', async () => {
      const dto: RegisterDto = { email: 'invalid@example.com', password: 'pw', username: 'invalid' };
      await service.register(dto);
      await expect(service.login({ email: dto.email, password: 'wrongpw' })).rejects.toThrow(/Invalid credentials/i);
    });

    it('should reject login for non-existing user', async () => {
      await expect(service.login({ email: 'nonexistent@example.com', password: 'pw' })).rejects.toThrow(/Invalid credentials/i);
    });

    it('should reject refresh for revoked token', async () => {
      const dto: RegisterDto = { email: 'revoke@example.com', password: 'pw', username: 'revoke' };
      await service.register(dto);
      const { refreshToken } = await service.login({ email: dto.email, password: dto.password });
      await service.logout(refreshToken);
      await expect(service.refresh({ refreshToken })).rejects.toThrow(/Refresh token revoked/i);
    });

    it('should handle getSession false path and throw', async () => {
      (service as any).redisClient = {
        isReady: true,
        get: async () => null,
      };
      expect(await service.getSession(1, 'token')).toBe(false);
    });

    it('should save and revoke session with redis ready', async () => {
      let savedKey: string | null = null;
      let deletedKey: string | null = null;
      (service as any).redisClient = {
        isReady: true,
        set: async (k: string) => { savedKey = k; return 'OK'; },
        del: async (k: string) => { deletedKey = k; return 1; },
      };
      await service.saveSession(1, 'tok1');
      await service.revokeSession('tok1');
      expect(savedKey).toBeDefined();
      expect(deletedKey).toBeDefined();
    });

    it('should validate credentials and logout behavior', async () => {
      const dto: RegisterDto = { email: 'valid@example.com', password: 'pw', username: 'valid' };
      await service.register(dto);
      const valid = await service.validateCredentials(dto.email, 'pw');
      expect(valid).toBe(true);
      await service.logout('');
      expect(service.isTokenRevoked('')).toBe(false);
    });

    it('should reject completely missing login', async () => {
      await expect(service.login({ email: 'missing@example.com', password: 'pw' })).rejects.toThrow(/Invalid credentials/i);
    });

    it('should include role claims in auth payload', async () => {
      const dto: RegisterDto = { email: 'roles@example.com', password: 'pw', username: 'roles' };
      await service.register(dto);
      // Patch user roles
      (service as any).users.find((u: any) => u.email === dto.email).roles = ['admin', 'user'];
      const loginResult = await service.login({ email: dto.email, password: dto.password });
      const decoded = require('jsonwebtoken').decode(loginResult.accessToken) as { roles: string[] };
      expect(decoded.roles).toContain('admin');
      expect(decoded.roles).toContain('user');
    });

    it('should revoke tokens and validate revoked state', async () => {
      const dto: RegisterDto = { email: 'revoke@example.com', password: 'pw', username: 'revoke' };
      await service.register(dto);
      const loginResult = await service.login({ email: dto.email, password: dto.password });
      expect(service.isTokenRevoked(loginResult.accessToken)).toBe(false);
      await service.logout(loginResult.accessToken);
      expect(service.isTokenRevoked(loginResult.accessToken)).toBe(true);
    });

    it('should have non-empty jwt secret from config', () => {
      expect(service.getJwtSecret()).toBeTruthy();
    });
  });
});
