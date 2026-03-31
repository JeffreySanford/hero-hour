import { Injectable } from '@nestjs/common';

@Injectable()
export class LifeProfileService {
  private profiles: Map<string, any> = new Map();

  async createProfile(userId: string, data: any) {
    if (this.profiles.has(userId)) {
      throw new Error('Profile already exists');
    }
    const profile = {
      userId,
      roles: data.roles || [],
      schedule: data.schedule || {},
      priorities: data.priorities || [],
      frictionPoints: data.frictionPoints || [],
      habitAnchors: data.habitAnchors || [],
    };
    this.profiles.set(userId, profile);
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const validRoles = ['parent', 'worker', 'student', 'athlete'];
    if (data.roles && data.roles.some((role: string) => !validRoles.includes(role))) {
      throw new Error('Invalid role enum');
    }

    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    Object.assign(profile, data);
    this.profiles.set(userId, profile);
    return profile;
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

  getProfile(userId: string) {
    const profile = this.profiles.get(userId);
    return profile || undefined;
  }
}
