import { Test, TestingModule } from '@nestjs/testing';
import { LifeProfileService } from './life-profile.service';

describe('LifeProfileService', () => {
  let service: LifeProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeProfileService],
    }).compile();

    service = module.get<LifeProfileService>(LifeProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create life profile for user', async () => {
    const userId = 'user1';
    const profile = await service.createProfile(userId, {
      firstName: 'Sam',
      lastName: 'Go',
      age: 30,
      preferredRole: 'leader',
      roles: ['student'],
    });

    expect(profile.userId).toBe(userId);
    expect(profile.firstName).toBe('Sam');
  });

  it('should update roles', async () => {
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
    await service.createProfile(userId, {
      firstName: 'Sam',
      lastName: 'Go',
      age: 30,
      preferredRole: 'member',
      schedule: { morning: 'work' },
    });
    const updated = await service.updateProfile(userId, { schedule: { evening: 'gym' } });
    expect(updated.schedule.evening).toBe('gym');
    expect(updated.schedule.morning).toBe('work');
  });

  it('should return only the requesting user profile', async () => {
    const userId = 'user4';
    await service.createProfile(userId, {
      firstName: 'Sam',
      lastName: 'Go',
      age: 30,
      preferredRole: 'member',
      roles: ['parent'],
    });
    const profile = await service.getProfile(userId);
    expect(profile.userId).toBe(userId);
    await expect(() => service.getProfile('otherUser')).toThrow('Profile not found');
  });
});
