import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

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
  private jwtSecret = 'testsecret';

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

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = this.users.find(u => u.email === dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.verified === false) throw new UnauthorizedException('User not verified');
    return this.issueTokens(user);
  }

  async refresh(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = jwt.verify(dto.refreshToken, this.jwtSecret) as { sub: number };
      const user = this.users.find(u => u.id === payload.sub);
      if (!user) throw new UnauthorizedException('Invalid refresh token');
      let newTokens = this.issueTokens(user);
      while (dto.refreshToken === newTokens.refreshToken || dto.refreshToken === newTokens.accessToken) {
        newTokens = this.issueTokens(user);
      }
      return newTokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private issueTokens(user: User) {
    const nonce = Math.random().toString(36).slice(2);
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, roles: user.roles, nonce },
      this.jwtSecret,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { sub: user.id, nonce },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const user = this.users.find(u => u.email === email);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }
}
