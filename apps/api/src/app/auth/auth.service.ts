import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import type { LoginResponse } from '@org/api-interfaces';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { createClient, RedisClientType } from 'redis';

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  verified?: boolean;
  roles?: string[];
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  private idSeq = 1;
  private jwtSecret = process.env.JWT_SECRET || 'testsecret';
  private revokedTokens = new Set<string>();
  private redisClient: RedisClientType | null = null;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    const isTestEnv = process.env.NODE_ENV === 'test';

    if (redisUrl && !isTestEnv) {
      this.redisClient = createClient({ url: redisUrl });
      this.redisClient.connect().catch((err) => console.error('Redis connect failed', err));
    }

    // Seed a local developer user for quick login during PI1 local run.
    if (this.users.length === 0) {
      const devPassword = 'password';
      const hashed = bcrypt.hashSync(devPassword, 10);
      this.users.push({
        id: this.idSeq++,
        email: 'admin@example.com',
        username: 'admin',
        password: hashed,
        verified: true,
        roles: ['user'],
      });
      console.log('[AuthService] seeded dev user admin@example.com / password');
    }
  }

  getJwtSecret(): string {
    return this.jwtSecret;
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  async register(dto: RegisterDto): Promise<User> {
    if (this.users.find(u => u.email === dto.email)) {
      throw new BadRequestException('Email already registered');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user: User = {
      id: this.idSeq++,
      email: dto.email,
      username: dto.username,
      password: hashed,
      verified: true,
      roles: ['user'],
    };
    this.users.push(user);
    return { ...user, password: 'hashed' };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = this.users.find(u => u.email === dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.verified === false) throw new UnauthorizedException('User not verified');
    return this.issueTokens(user);
  }

  async refresh(dto: RefreshTokenDto): Promise<LoginResponse> {
    if (this.revokedTokens.has(dto.refreshToken)) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    try {
      const payload = jwt.verify(dto.refreshToken, this.jwtSecret) as { sub: number };
      const user = this.users.find(u => u.id === payload.sub);
      if (!user) throw new UnauthorizedException('Invalid refresh token');

      const active = await this.getSession(user.id, dto.refreshToken);
      if (!active) {
        throw new UnauthorizedException('Refresh token not recognised');
      }

      const newTokens = this.issueTokens(user);
      this.revokedTokens.add(dto.refreshToken);
      await this.revokeSession(dto.refreshToken);
      return newTokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private issueTokens(user: User): LoginResponse {
    const nonce = Math.random().toString(36).slice(2);
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, roles: user.roles, nonce },
      this.jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    const refreshToken = jwt.sign(
      { sub: user.id, nonce },
      this.jwtSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    void this.saveSession(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async saveSession(userId: number, refreshToken: string): Promise<void> {
    if (!this.redisClient) return;
    try {
      await this.redisClient.set(`session:${refreshToken}`, JSON.stringify({ userId }), {
        EX: parseInt(process.env.SESSION_TTL_SEC ?? '604800', 10),
      });
    } catch (e) {
      console.error('Failed to store session in Redis', e);
    }
  }

  private async revokeSession(refreshToken: string): Promise<void> {
    if (!this.redisClient) return;
    try {
      await this.redisClient.del(`session:${refreshToken}`);
    } catch (e) {
      console.error('Failed to revoke session in Redis', e);
    }
  }

  private async getSession(userId: number, refreshToken: string): Promise<boolean> {
    if (!this.redisClient) return true;
    try {
      const value = await this.redisClient.get(`session:${refreshToken}`);
      if (!value) return false;
      const payload = JSON.parse(value);
      return payload.userId === userId;
    } catch (e) {
      console.error('Failed to read session from Redis', e);
      return false;
    }
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const user = this.users.find(u => u.email === email);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  async logout(token: string): Promise<void> {
    if (!token) return;
    this.revokedTokens.add(token);
    await this.revokeSession(token);
  }
}
