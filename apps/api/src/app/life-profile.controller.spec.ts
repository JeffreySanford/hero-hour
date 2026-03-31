import { Test, TestingModule } from '@nestjs/testing';
import { LifeProfileController } from './life-profile.controller';

describe('LifeProfileController', () => {
  let controller: LifeProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeProfileController],
    }).compile();

    controller = module.get<LifeProfileController>(LifeProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { LifeProfileController } from './life-profile.controller';

describe('LifeProfileController', () => {
  let controller: LifeProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeProfileController],
    }).compile();

    controller = module.get<LifeProfileController>(LifeProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
