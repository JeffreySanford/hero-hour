import { Test, TestingModule } from '@nestjs/testing';
import { LifeProfileService } from './life-profile.service';
import { TelemetryService } from '../telemetry/telemetry.service';
import { TelemetryAuditRepository } from '@org/domain';

describe('LifeProfileService', () => {
  let service: LifeProfileService;
  let telemetry: TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeProfileService, TelemetryService, TelemetryAuditRepository],
    }).compile();
    service = module.get<LifeProfileService>(LifeProfileService);
    telemetry = module.get<TelemetryService>(TelemetryService);
    telemetry.clear();
  });

  it('should create life profile for user', async () => {
    const userId = 'user1';
    const profile = await service.createProfile(userId, {
      firstName: 'Sam',
      lastName: 'Go',
      age: 30,
      preferredRole: 'member',
      roles: ['parent'],
    });
    expect(profile.userId).toBe(userId);
    expect(profile.roles).toContain('parent');

    const events = telemetry.list('lifeProfileUpdated', userId);
    expect(events.length).toBe(1);
    expect(events[0].payload.details.event).toBe('createProfile');
  });

  it('should update life roles', async () => {
    const userId = 'user2';
    await service.createProfile(userId, {
      firstName: 'Sam',
      lastName: 'Go',
      age: 30,
      preferredRole: 'member',
      roles: ['student'],
    });
    const updated = await service.updateProfile(userId, { roles: ['student', 'athlete'] });
    expect(updated.roles).toContain('athlete');
  });

  it('should update schedule profile without overwriting other sections', async () => {
    const userId = 'user3';
    await service.createProfile(userId, { roles: ['worker'], schedule: { morning: 'work' } });
    const updated = await service.updateProfile(userId, { schedule: { evening: 'gym' } });
    expect(updated.schedule.evening).toBe('gym');
    expect(updated.roles).toContain('worker');
  });

  it('should update priorities and frictions', async () => {
    const userId = 'user4';
    await service.createProfile(userId, { priorities: ['health'] });
    const updated = await service.updateProfile(userId, { frictions: ['procrastination'] });
    expect(updated.priorities).toContain('health');
    expect(updated.frictions).toContain('procrastination');
  });

  it('should save habit anchors', async () => {
    const userId = 'user5';
    await service.createProfile(userId, {});
    const updated = await service.updateProfile(userId, { habitAnchors: ['wake up', 'read'] });
    expect(updated.habitAnchors).toContain('read');
  });

  it('should reject invalid enum values', async () => {
    const userId = 'user6';
    await service.createProfile(userId, {});
    await expect(service.updateProfile(userId, { roles: ['invalidRole'] })).rejects.toThrow();
  });

  it('should merge partial updates without wiping existing data', async () => {
    const userId = 'user7';
    await service.createProfile(userId, { priorities: ['career'], schedule: { morning: 'study' } });
    const updated = await service.updateProfile(userId, { priorities: ['health'] });
    expect(updated.priorities).toContain('health');
    expect(updated.schedule.morning).toBe('study');
  });

  it('should return only the requesting user profile', async () => {
    const userId = 'user8';
    await service.createProfile(userId, { roles: ['parent'] });
    const profile = await service.getProfile(userId);
    expect(profile.userId).toBe(userId);
    // Should not return other users' profiles
    const other = await service.getProfile('otherUser');
    expect(other).toBeUndefined();
  });

  it('should support updateRoles and direct schedule updates', async () => {
    const userId = 'user9';
    await service.createProfile(userId, { roles: ['member'], schedule: { morning: 'code' } });
    const roleUpdated = await service.updateRoles(userId, ['leader', 'student']);
    expect(roleUpdated.roles).toEqual(['leader', 'student']);

    const scheduleUpdated = await service.updateSchedule(userId, { night: 'rest' });
    expect(scheduleUpdated.schedule).toEqual({ morning: 'code', night: 'rest' });
  });

  it('should support update priorities/friction/habit anchors', async () => {
    const userId = 'user11';
    await service.createProfile(userId, {
      priorities: ['focus'],
      frictionPoints: ['distraction'],
      habitAnchors: ['morning routine'],
    });

    const p = await service.updatePriorities(userId, ['clarity']);
    expect(p.priorities).toEqual(['clarity']);

    const f = await service.updateFrictionPoints(userId, ['fatigue']);
    expect(f.frictionPoints).toEqual(['fatigue']);

    const h = await service.saveHabitAnchors(userId, ['evening ritual']);
    expect(h.habitAnchors).toEqual(['evening ritual']);
  });

  it('should use default and filtered roles and assign member fallback on invalid role', async () => {
    const userId = 'user12';
    const profile = await service.createProfile(userId, {
      firstName: 'Test',
      lastName: 'User',
      age: 21,
      preferredRole: 'invalid' as any,
      roles: ['unknown', 'parent'],
    });
    expect(profile.preferredRole).toBe('member');
    expect(profile.roles).toEqual(['parent']);
  });

  it('should throw on updating missing profile and on invalid role in updateRoles', async () => {
    await expect(service.updateProfile('not-there', { firstName: 'X' })).rejects.toThrow('Profile not found');
    const userId = 'user13';
    await service.createProfile(userId, { firstName: 'A', lastName: 'B', age: 30 });
    await expect(service.updateRoles(userId, ['fake'])).rejects.toThrow('Invalid role enum');
  });

  it('should upsert on duplicate create and invalid update roles remains protected', async () => {
    const userId = 'user10';
    await service.createProfile(userId, { firstName: 'A', lastName: 'B', age: 25 });
    const duplicate = await service.createProfile(userId, { firstName: 'A', lastName: 'B', age: 25 });
    expect(duplicate.age).toBe(25);

    const updated = await service.createProfile(userId, { firstName: 'A', lastName: 'B', age: 26 });
    expect(updated.age).toBe(26);

    await expect(service.updateRoles(userId, ['invalidRole' as any])).rejects.toThrow('Invalid role enum');
  });
});
