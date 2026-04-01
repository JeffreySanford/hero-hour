import { LifeProfile } from './life-profile.service';

export interface LifeProfileFormValue {
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: 'leader' | 'member' | 'observer';
}

export function mapFormToLifeProfile(value: LifeProfileFormValue, userId = 'demo-user'): LifeProfile {
  return {
    userId,
    firstName: value.firstName.trim(),
    lastName: value.lastName.trim(),
    age: Number(value.age),
    preferredRole: value.preferredRole,
  };
}
