import { Injectable } from '@nestjs/common';

export interface LifeProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  preferredRole?: 'leader' | 'member' | 'observer';
  roles: string[];
  schedule: Record<string, any>;
  priorities: string[];
  frictionPoints: string[];
  habitAnchors: string[];
}

@Injectable()
export class LifeProfileService {
  private profiles: Map<string, LifeProfile> = new Map();

  async createProfile(userId: string, data: any): Promise<LifeProfile> {
    if (this.profiles.has(userId)) {
      throw new Error('Profile already exists');
    }

    const profile: LifeProfile = {
      userId,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      age: data.age || 0,
      preferredRole: data.preferredRole || 'member',
      roles: data.roles || [],
      schedule: data.schedule || {},
      priorities: data.priorities || [],
      frictionPoints: data.frictionPoints || [],
      habitAnchors: data.habitAnchors || [],
    };
    this.profiles.set(userId, profile);
    return profile;
  }

  async updateProfile(userId: string, data: any): Promise<LifeProfile> {
    const validRoles = ['leader', 'member', 'observer', 'parent', 'worker', 'student', 'athlete'];
    if (data.roles && data.roles.some((role: string) => !validRoles.includes(role))) {
      throw new Error('Invalid role enum');
    }

    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const updated = {
      ...profile,
      ...data,
      userId,
    };

    this.profiles.set(userId, updated);
    return updated;
  }

  async updateRoles(userId: string, roles: string[]) {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.roles = roles;
    this.profiles.set(userId, profile);
    return profile;
  }

  async updateSchedule(userId: string, schedule: any) {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.schedule = { ...profile.schedule, ...schedule };
    this.profiles.set(userId, profile);
    return profile;
  }

  async updatePriorities(userId: string, priorities: string[]) {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.priorities = priorities;
    this.profiles.set(userId, profile);
    return profile;
  }

  async updateFrictionPoints(userId: string, frictionPoints: string[]) {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.frictionPoints = frictionPoints;
    this.profiles.set(userId, profile);
    return profile;
  }

  async saveHabitAnchors(userId: string, anchors: string[]) {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.habitAnchors = anchors;
    this.profiles.set(userId, profile);
    return profile;
  }

  getProfile(userId: string): LifeProfile | undefined {
    return this.profiles.get(userId);
  }
}
