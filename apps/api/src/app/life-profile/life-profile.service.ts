import { Injectable } from '@nestjs/common';
import type { LifeProfile, LifeProfileRequest, LifeRole, ProfileStatus } from '@org/api-interfaces';

const DEFAULT_ROLES: LifeRole[] = ['member'];
const VALID_ROLES: LifeRole[] = ['leader', 'member', 'observer', 'parent', 'worker', 'student', 'athlete'];

@Injectable()
export class LifeProfileService {
  private profiles: Map<string, LifeProfile> = new Map();

  async createProfile(userId: string, data: LifeProfileRequest): Promise<LifeProfile> {
    if (this.profiles.has(userId)) {
      throw new Error('Profile already exists');
    }

    const preferredRole = VALID_ROLES.includes(data.preferredRole) ? data.preferredRole : 'member';
    const roles = data.roles?.length ? data.roles.filter((r) => VALID_ROLES.includes(r)) : DEFAULT_ROLES;

    const profile: LifeProfile = {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      preferredRole,
      roles,
      schedule: data.schedule || {},
      priorities: data.priorities || [],
      frictionPoints: data.frictionPoints || [],
      habitAnchors: data.habitAnchors || [],
      status: 'active' as ProfileStatus,
      privacy: data.privacy || 'private',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.profiles.set(userId, profile);
    return profile;
  }

  async updateProfile(userId: string, data: Partial<LifeProfileRequest>): Promise<LifeProfile> {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    if (data.roles && data.roles.some((role) => !VALID_ROLES.includes(role))) {
      throw new Error('Invalid role enum');
    }

    const updated: LifeProfile = {
      ...profile,
      ...data,
      userId,
      preferredRole: data.preferredRole && VALID_ROLES.includes(data.preferredRole) ? data.preferredRole : profile.preferredRole,
      roles: data.roles && data.roles.length ? data.roles.filter((r) => VALID_ROLES.includes(r)) : profile.roles,
      updatedAt: new Date().toISOString(),
    };

    this.profiles.set(userId, updated);
    return updated;
  }

  async updateRoles(userId: string, roles: LifeRole[]) {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    if (roles.some((role) => !VALID_ROLES.includes(role))) {
      throw new Error('Invalid role enum');
    }
    profile.roles = roles;
    profile.updatedAt = new Date().toISOString();
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
