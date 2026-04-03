import type { LifeProfile, LifeProfileRequest, LifeRole, ProfileStatus, PrivacySetting, LoginResponse, HealthResponse } from './api-interfaces';
import { apiInterfaces } from './api-interfaces';
import Ajv from 'ajv';

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

  it('should validate login and health schema via Ajv', () => {
    const ajv = new Ajv({ allErrors: true });

    const loginSchema = {
      type: 'object',
      required: ['accessToken', 'refreshToken'],
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
      additionalProperties: false,
    };

    const healthSchema = {
      type: 'object',
      required: ['status', 'uptime'],
      properties: {
        status: { type: 'string', enum: ['ok', 'degraded', 'down'] },
        uptime: { type: 'number' },
      },
      additionalProperties: false,
    };

    const validLogin: LoginResponse = { accessToken: 'abc', refreshToken: 'xyz' };
    const validHealth: HealthResponse = { status: 'ok', uptime: 112233 }; 

    const validateLogin = ajv.compile(loginSchema);
    const validateHealth = ajv.compile(healthSchema);

    expect(validateLogin(validLogin)).toBe(true);
    expect(validateHealth(validHealth)).toBe(true);

    expect(validateLogin({ accessToken: 'abc' })).toBe(false);
    expect(validateHealth({ status: 'wrong', uptime: 1 })).toBe(false);
  });
});
