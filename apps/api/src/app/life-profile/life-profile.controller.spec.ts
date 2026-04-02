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
            createProfile: jest.fn(),
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
    const dto: CreateLifeProfileDto = { userId: 'u1', firstName: 'John', lastName: 'Doe', age: 30, preferredRole: 'leader' };
    (service.createProfile as jest.Mock).mockResolvedValue('created');
    expect(await controller.create(dto)).toBe('created');
    expect(service.createProfile).toHaveBeenCalledWith('u1', {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      preferredRole: 'leader',
    });
  });

  it('should create a life profile on the root endpoint alias', async () => {
    const dto: CreateLifeProfileDto = { userId: 'u1', firstName: 'John', lastName: 'Doe', age: 30, preferredRole: 'leader' };
    (service.createProfile as jest.Mock).mockResolvedValue('created');
    expect(await controller.createRoot(dto)).toBe('created');
  });

  it('should get a life profile by user id', async () => {
    (service.getProfile as jest.Mock).mockReturnValue({ userId: 'u1', firstName: 'John' });
    await expect(controller.get('u1')).resolves.toEqual({ userId: 'u1', firstName: 'John' });
    expect(service.getProfile).toHaveBeenCalledWith('u1');
  });

  it('should update roles', async () => {
    const dto: UpdateLifeRolesDto = { userId: 'u1', roles: ['hero'] };
    (service.updateRoles as jest.Mock).mockResolvedValue('roles updated');
    expect(await controller.updateRoles(dto)).toBe('roles updated');
    expect(service.updateRoles).toHaveBeenCalledWith('u1', ['hero']);
  });

  it('should update schedule', async () => {
    const dto: UpdateScheduleDto = { userId: 'u1', schedule: { monday: 'work' } };
    (service.updateSchedule as jest.Mock).mockResolvedValue('schedule updated');
    expect(await controller.updateSchedule(dto)).toBe('schedule updated');
    expect(service.updateSchedule).toHaveBeenCalledWith('u1', { monday: 'work' });
  });

  it('should save habit anchors', async () => {
    const dto: SaveHabitAnchorsDto = { userId: 'u1', anchors: ['anchor1'] };
    (service.saveHabitAnchors as jest.Mock).mockResolvedValue('anchors saved');
    expect(await controller.saveHabitAnchors(dto)).toBe('anchors saved');
    expect(service.saveHabitAnchors).toHaveBeenCalledWith('u1', ['anchor1']);
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
