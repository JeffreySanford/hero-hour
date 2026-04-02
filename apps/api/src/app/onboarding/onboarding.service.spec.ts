import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  let service: OnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardingService],
    }).compile();
    service = module.get<OnboardingService>(OnboardingService);
  });

  describe('Onboarding flow', () => {
    it('should initialize onboarding state for new user', async () => {
      const userId = 'user-1';
      const onboarding = await service.initOnboarding(userId);
      expect(onboarding.userId).toBe(userId);
      expect(onboarding.steps).toEqual([]);
      expect(onboarding.completed).toBe(false);
    });

    it('should save onboarding step progression', async () => {
      const userId = 'user-2';
      await service.initOnboarding(userId);
      const step = { type: 'life-role', data: { roles: ['parent', 'worker'] } };
      const updated = await service.saveStep(userId, step);
      expect(updated.steps).toContainEqual(step);
    });

    it('should resume partially completed onboarding', async () => {
      const userId = 'user-3';
      await service.initOnboarding(userId);
      await service.saveStep(userId, { type: 'life-role', data: { roles: ['student'] } });
      const resumed = await service.getOnboarding(userId);
      expect(resumed.steps.length).toBe(1);
      expect(resumed.completed).toBe(false);
    });

    it('should reject onboarding completion when required sections are missing', async () => {
      const userId = 'user-4';
      await service.initOnboarding(userId);
      // Only one step, not enough to complete
      await service.saveStep(userId, { type: 'life-role', data: { roles: ['student'] } });
      await expect(service.completeOnboarding(userId)).rejects.toThrow(/required sections/);
    });

    it('should complete onboarding when all required sections exist', async () => {
      const userId = 'user-5';
      await service.initOnboarding(userId);
      await service.saveStep(userId, { type: 'life-role', data: { roles: ['student'] } });
      await service.saveStep(userId, { type: 'priority', data: { priorities: ['health'] } });
      await service.saveStep(userId, { type: 'friction', data: { frictions: ['time'] } });
      const completed = await service.completeOnboarding(userId);
      expect(completed.completed).toBe(true);
    });

    it('should avoid duplicate starter profile generation', async () => {
      const userId = 'user-6';
      await service.initOnboarding(userId);
      await service.saveStep(userId, { type: 'life-role', data: { roles: ['student'] } });
      await service.saveStep(userId, { type: 'priority', data: { priorities: ['health'] } });
      await service.saveStep(userId, { type: 'friction', data: { frictions: ['time'] } });
      await service.completeOnboarding(userId);
      // Try to complete again
      const result = await service.completeOnboarding(userId);
      expect(result.starterProfileGenerated).toBe(true);
    });

    it('should handle optional skipped sections safely', async () => {
      const userId = 'user-7';
      await service.initOnboarding(userId);
      await service.saveStep(userId, { type: 'life-role', data: { roles: ['student'] } });
      // Skip optional step
      await service.saveStep(userId, { type: 'priority', data: { priorities: ['health'] } });
      const completed = await service.completeOnboarding(userId);
      expect(completed.completed).toBe(true);
    });

    it('should support saveStep as object and handle missing fields', async () => {
      const userId = 'user-8';
      await service.initOnboarding(userId);
      const saved = service.saveStep({ userId, stepName: 'life-role', payload: { roles: ['leader'] } } as any);
      expect(saved).toBeDefined();
    });

    it('should throw when required fields are missing in saveStep object form', async () => {
      expect(() => service.saveStep({ userId: 'missing' } as any)).toThrow(/Missing required fields/);
    });

    it('should throw on unsupported complete on missing user', async () => {
      await expect(service.completeOnboarding('missing')).rejects.toThrow(/Onboarding not found/);
    });
  });
});
