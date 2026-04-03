import { Injectable } from '@nestjs/common';
import type { LifeProfile, LifeProfileRequest, LifeRole, ProfileStatus, TelemetryEventPayload } from '@org/api-interfaces';
import { TelemetryService } from '../telemetry/telemetry.service';

const DEFAULT_ROLES: LifeRole[] = ['member'];
const VALID_ROLES: LifeRole[] = ['leader', 'member', 'observer', 'parent', 'worker', 'student', 'athlete'];

@Injectable()
export class LifeProfileService {
  private profiles: Map<string, LifeProfile> = new Map();

  constructor(private readonly telemetryService: TelemetryService) {}

  async createProfile(userId: string, data: LifeProfileRequest): Promise<LifeProfile> {
    const existing = this.profiles.get(userId);

    if (existing) {
      const sameProfile =
        existing.firstName === data.firstName &&
        existing.lastName === data.lastName &&
        existing.age === data.age &&
        existing.preferredRole === data.preferredRole &&
        JSON.stringify(existing.roles) === JSON.stringify(data.roles || existing.roles) &&
        JSON.stringify(existing.schedule) === JSON.stringify(data.schedule || existing.schedule) &&
        JSON.stringify(existing.priorities) === JSON.stringify(data.priorities || existing.priorities) &&
        JSON.stringify(existing.frictionPoints) === JSON.stringify(data.frictionPoints || existing.frictionPoints) &&
        JSON.stringify(existing.habitAnchors) === JSON.stringify(data.habitAnchors || existing.habitAnchors) &&
        existing.privacy === (data.privacy || existing.privacy);

      if (sameProfile) {
        // Profile exists and matches supplied data; no change needed.
        return existing;
      }

      // Profile exists; merge updates from provided data and persist.
      return this.updateProfile(userId, data);
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

    this.telemetryService.record({
      type: 'lifeProfileUpdated',
      userId,
      payload: { userId, details: { event: 'createProfile', profile } } as TelemetryEventPayload,
    });

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

    this.telemetryService.record({
      type: 'lifeProfileUpdated',
      userId,
      payload: { userId, details: { event: 'updateProfile', updated } } as TelemetryEventPayload,
    });

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

    this.telemetryService.record({
      type: 'lifeProfileUpdated',
      userId,
      payload: { userId, details: { event: 'updateRoles', roles } } as TelemetryEventPayload,
    });

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
