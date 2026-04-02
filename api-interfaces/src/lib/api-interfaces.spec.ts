import type { LifeProfile, LifeProfileRequest, LifeRole, ProfileStatus, PrivacySetting } from './api-interfaces';
import { apiInterfaces } from './api-interfaces';

describe('apiInterfaces', () => {
  it('should work', () => {
    expect(apiInterfaces()).toEqual('api-interfaces');
  });

  it('should define the life-profile role and privacy enums', () => {
    const role: LifeRole = 'leader';
    const privacy: PrivacySetting = 'private';
    const status: ProfileStatus = 'active';

    expect(role).toBe('leader');
    expect(privacy).toBe('private');
    expect(status).toBe('active');
  });

  it('should validate life-profile shape and required fields', () => {
    const example: LifeProfile = {
      userId: 'demo-user',
      firstName: 'Anne',
      lastName: 'Lee',
      age: 32,
      preferredRole: 'member',
      roles: ['member'],
      schedule: { morning: 'run' },
      priorities: ['health', 'career'],
      frictionPoints: ['procrastination'],
      habitAnchors: ['wake-up', 'coffee'],
      status: 'active',
      privacy: 'private',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(example).toHaveProperty('userId', 'demo-user');
    expect(example).toHaveProperty('preferredRole');
    expect(example.roles).toContain('member');
    expect(example.status).toBe('active');
  });

  it('should have a contract check that fails on mismatch', () => {
    const payload: LifeProfileRequest = {
      userId: 'demo-user',
      firstName: 'Ana',
      lastName: 'Bell',
      age: 28,
      preferredRole: 'member',
    };

    expect(payload).toMatchObject({
      userId: 'demo-user',
      firstName: 'Ana',
      lastName: 'Bell',
      age: 28,
      preferredRole: 'member',
    });
  });
});
