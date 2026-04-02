import type { LifeProfile, LifeRole } from '@org/api-interfaces';

export interface LifeProfileFormValue {
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: LifeRole;
}

export function mapFormToLifeProfile(value: LifeProfileFormValue, userId = 'demo-user'): LifeProfile {
  return {
    userId,
    firstName: value.firstName.trim(),
    lastName: value.lastName.trim(),
    age: Number(value.age),
    preferredRole: value.preferredRole,
    roles: [value.preferredRole],
    schedule: {},
    priorities: [],
    frictionPoints: [],
    habitAnchors: [],
    status: 'active',
    privacy: 'private',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
