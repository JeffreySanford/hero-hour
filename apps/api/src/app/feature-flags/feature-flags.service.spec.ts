import { Test, TestingModule } from '@nestjs/testing';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureFlagsService],
    }).compile();

    service = module.get<FeatureFlagsService>(FeatureFlagsService);
  });

  it('should default to base flag values', () => {
    expect(service.isEnabled('weeklyChallenges')).toBe(true);
    expect(service.isEnabled('richerProgression')).toBe(false);
  });

  it('should allow toggling feature flags', () => {
    service.set('richerProgression', true);
    expect(service.isEnabled('richerProgression')).toBe(true);

    const list = service.list();
    expect(list.richerProgression).toBe(true);
  });
});