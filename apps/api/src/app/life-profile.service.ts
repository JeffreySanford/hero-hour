import { Injectable, NotFoundException } from '@nestjs/common';

export interface LifeProfile {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: 'leader' | 'member' | 'observer';
  roles: string[];
  schedule: Record<string, any>;
  priorities: string[];
  frictionPoints: string[];
  habitAnchors: string[];
}

@Injectable()
export class LifeProfileService {
  private profiles: Map<string, LifeProfile> = new Map();

  createProfile(userId: string, data: any): LifeProfile {
    const existing = this.profiles.get(userId);

    if (existing) {
      const sameProfile =
        existing.firstName === (data.firstName || existing.firstName) &&
        existing.lastName === (data.lastName || existing.lastName) &&
        existing.age === (data.age ?? existing.age) &&
        existing.preferredRole === (data.preferredRole || existing.preferredRole) &&
        JSON.stringify(existing.roles) === JSON.stringify(data.roles || existing.roles) &&
        JSON.stringify(existing.schedule) === JSON.stringify(data.schedule || existing.schedule) &&
        JSON.stringify(existing.priorities) === JSON.stringify(data.priorities || existing.priorities) &&
        JSON.stringify(existing.frictionPoints) === JSON.stringify(data.frictionPoints || existing.frictionPoints) &&
        JSON.stringify(existing.habitAnchors) === JSON.stringify(data.habitAnchors || existing.habitAnchors);

      if (sameProfile) {
        return existing;
      }

      return this.updateProfile(userId, data);
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

  updateProfile(userId: string, data: any): LifeProfile {
    const existing = this.getProfile(userId);
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }

    const updated: LifeProfile = {
      ...existing,
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      age: data.age ?? existing.age,
      preferredRole: data.preferredRole ?? existing.preferredRole,
      roles: data.roles ?? existing.roles,
      schedule: data.schedule ? { ...existing.schedule, ...data.schedule } : existing.schedule,
      priorities: data.priorities ?? existing.priorities,
      frictionPoints: data.frictionPoints ?? existing.frictionPoints,
      habitAnchors: data.habitAnchors ?? existing.habitAnchors,
      userId,
    };

    this.profiles.set(userId, updated);
    return updated;
  }

  updateRoles(userId: string, roles: string[]): LifeProfile {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.roles = roles;
    this.profiles.set(userId, profile);
    return profile;
  }

  updateSchedule(userId: string, schedule: any): LifeProfile {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.schedule = { ...profile.schedule, ...schedule };
    this.profiles.set(userId, profile);
    return profile;
  }

  updatePriorities(userId: string, priorities: string[]): LifeProfile {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.priorities = priorities;
    this.profiles.set(userId, profile);
    return profile;
  }

  updateFrictionPoints(userId: string, frictionPoints: string[]): LifeProfile {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.frictionPoints = frictionPoints;
    this.profiles.set(userId, profile);
    return profile;
  }

  saveHabitAnchors(userId: string, anchors: string[]): LifeProfile {
    const profile = this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    profile.habitAnchors = anchors;
    this.profiles.set(userId, profile);
    return profile;
  }

  getProfile(userId: string): LifeProfile {
    const profile = this.profiles.get(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}

