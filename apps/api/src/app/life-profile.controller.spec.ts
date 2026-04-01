import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { LifeProfileController } from './life-profile.controller';
import { LifeProfileService } from './life-profile.service';

describe('LifeProfileController', () => {
  let controller: LifeProfileController;
  let service: LifeProfileService;

  beforeEach(async () => {
    service = new LifeProfileService();
    controller = new LifeProfileController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create life-profile successfully', async () => {
    const dto = {
      userId: 'test-user',
      firstName: 'Anne',
      lastName: 'Lee',
      age: 32,
      preferredRole: 'member',
    };

    const result = await controller.create(dto as any);

    expect(result).toMatchObject({
      userId: 'test-user',
      firstName: 'Anne',
      lastName: 'Lee',
      age: 32,
      preferredRole: 'member',
    });
  });

  it('should throw conflict on duplicate create', async () => {
    const dto = {
      userId: 'test-user-dup',
      firstName: 'Sam',
      lastName: 'Go',
      age: 35,
      preferredRole: 'leader',
    };

    await controller.create(dto as any);

    await expect(controller.create({ ...dto, age: 36 } as any)).rejects.toThrow(ConflictException);
    expect(service.getProfile('test-user-dup')?.age).toBe(35);
  });

  it('should throw conflict exception when service already throws exists', async () => {
    jest.spyOn(service, 'createProfile').mockImplementation(async () => {
      throw new Error('already exists');
    });

    await expect(
      controller.create({
        userId: 'conflict-user',
        firstName: 'X',
        lastName: 'Y',
        age: 40,
        preferredRole: 'member',
      } as any),
    ).rejects.toThrow(ConflictException);
  });
});
