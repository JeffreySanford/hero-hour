import { Injectable } from '@nestjs/common';

export interface GameProfile {
  userId: string;
  avatar: string;
  theme: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
}

@Injectable()
export class GameProfileService {
  private profiles: Map<string, GameProfile> = new Map();

  async initProfile(userId: string): Promise<GameProfile> {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = {
        userId,
        avatar: 'default',
        theme: 'default',
        displayName: '',
        xp: 0,
        level: 1,
        streak: 0,
      };
      this.profiles.set(userId, profile);
    }
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<Omit<GameProfile, 'userId'>>): Promise<GameProfile> {
    const profile = await this.initProfile(userId);
    if (updates.avatar !== undefined) profile.avatar = updates.avatar;
    if (updates.theme !== undefined) profile.theme = updates.theme;
    if (updates.displayName !== undefined) profile.displayName = updates.displayName;
    if (updates.xp !== undefined) profile.xp = updates.xp;
    if (updates.level !== undefined) profile.level = updates.level;
    if (updates.streak !== undefined) profile.streak = updates.streak;
    this.profiles.set(userId, profile);
    return profile;
  }

  async getProfile(userId: string): Promise<GameProfile> {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Game profile not found');
    return profile;
  }

  async updateAvatarTheme(dto: { userId: string; avatar?: string; theme?: string }): Promise<GameProfile> {
    const profile = await this.getProfile(dto.userId);
    if (dto.avatar !== undefined) profile.avatar = dto.avatar;
    if (dto.theme !== undefined) profile.theme = dto.theme;
    this.profiles.set(dto.userId, profile);
    return profile;
  }
}
