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
});
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
});
