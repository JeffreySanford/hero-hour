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

  it('should update existing profile on duplicate create via upsert', async () => {
    const dto = {
      userId: 'test-user-dup',
      firstName: 'Sam',
      lastName: 'Go',
      age: 35,
      preferredRole: 'leader',
      roles: ['student'],
    };

    await controller.create(dto as any);
    const result = await controller.create({ ...dto, age: 36 } as any);

    expect(result.age).toBe(36);
    expect(service.getProfile('test-user-dup')?.age).toBe(36);
  });

  it('should return existing profile unchanged if request matches existing profile', async () => {
    const dto = {
      userId: 'conflict-user',
      firstName: 'X',
      lastName: 'Y',
      age: 40,
      preferredRole: 'member',
    };

    await controller.create(dto as any);
    const result = await controller.create(dto as any);

    expect(result.age).toBe(40);
    expect(service.getProfile('conflict-user')?.age).toBe(40);
  });
});
