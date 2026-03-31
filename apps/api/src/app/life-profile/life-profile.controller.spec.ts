import { Test, TestingModule } from '@nestjs/testing';
import { LifeProfileController } from './life-profile.controller';
import { LifeProfileService } from './life-profile.service';
import { CreateLifeProfileDto, UpdateLifeRolesDto, UpdateScheduleDto, SaveHabitAnchorsDto } from './life-profile.dto';

describe('LifeProfileController', () => {
  let controller: LifeProfileController;
  let service: LifeProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeProfileController],
      providers: [
        {
          provide: LifeProfileService,
          useValue: {
            create: jest.fn(),
            updateRoles: jest.fn(),
            updateSchedule: jest.fn(),
            saveHabitAnchors: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LifeProfileController>(LifeProfileController);
    service = module.get<LifeProfileService>(LifeProfileService);
  });

  it('should create a life profile', async () => {
    const dto: CreateLifeProfileDto = { userId: 'u1' };
    (service.create as jest.Mock).mockResolvedValue('created');
    expect(await controller.create(dto)).toBe('created');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update roles', async () => {
    const dto: UpdateLifeRolesDto = { userId: 'u1', roles: ['hero'] };
    (service.updateRoles as jest.Mock).mockResolvedValue('roles updated');
    expect(await controller.updateRoles(dto)).toBe('roles updated');
    expect(service.updateRoles).toHaveBeenCalledWith(dto);
  });

  it('should update schedule', async () => {
    const dto: UpdateScheduleDto = { userId: 'u1', schedule: { monday: 'work' } };
    (service.updateSchedule as jest.Mock).mockResolvedValue('schedule updated');
    expect(await controller.updateSchedule(dto)).toBe('schedule updated');
    expect(service.updateSchedule).toHaveBeenCalledWith(dto);
  });

  it('should save habit anchors', async () => {
    const dto: SaveHabitAnchorsDto = { userId: 'u1', anchors: ['anchor1'] };
    (service.saveHabitAnchors as jest.Mock).mockResolvedValue('anchors saved');
    expect(await controller.saveHabitAnchors(dto)).toBe('anchors saved');
    expect(service.saveHabitAnchors).toHaveBeenCalledWith(dto);
  });

  it('should get my profile', async () => {
    (service.getProfile as jest.Mock).mockResolvedValue({ userId: 'u1' });
    const req = { user: { id: 'u1' } };
    expect(await controller.getMyProfile(req)).toEqual({ userId: 'u1' });
    expect(service.getProfile).toHaveBeenCalledWith('u1');
  });

  it('should throw if missing user in getMyProfile', async () => {
    await expect(controller.getMyProfile({} as any)).rejects.toThrow();
  });
});
