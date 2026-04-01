import { Test, TestingModule } from '@nestjs/testing';
import { GameProfileController } from './game-profile.controller';
import { GameProfileService } from './game-profile.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UpdateAvatarThemeDto } from './game-profile.dto';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';

describe('GameProfileController', () => {
  let controller: GameProfileController;
  let service: GameProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameProfileController],
      providers: [
        {
          provide: GameProfileService,
          useValue: {
            getProfile: jest.fn(),
            updateAvatarTheme: jest.fn(),
            createQuest: jest.fn(),
            getQuests: jest.fn(),
            updateQuest: jest.fn(),
            logActivity: jest.fn(),
            getWorldState: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getJwtSecret: () => 'testsecret',
            isTokenRevoked: () => false,
          },
        },
        {
          provide: JwtGuard,
          useValue: {
            canActivate: () => true,
          },
        },
      ],
    }).compile();

    controller = module.get<GameProfileController>(GameProfileController);
    service = module.get<GameProfileService>(GameProfileService);
  });

  it('should get my game profile', async () => {
    (service.getProfile as jest.Mock).mockResolvedValue({ userId: 'u1' });
    expect(await controller.getMyProfile('u1')).toEqual({ userId: 'u1' });
    expect(service.getProfile).toHaveBeenCalledWith('u1');
  });

  it('should throw if missing userId in getMyProfile', async () => {
    await expect(controller.getMyProfile(undefined as any)).rejects.toThrow();
  });

  it('should update avatar/theme', async () => {
    const dto: UpdateAvatarThemeDto = { userId: 'u1', avatar: 'hero', theme: 'dark' };
    (service.updateAvatarTheme as jest.Mock).mockResolvedValue('updated');
    expect(await controller.updateAvatarTheme(dto)).toBe('updated');
    expect(service.updateAvatarTheme).toHaveBeenCalledWith(dto);
  });

  it('should throw BadRequestException for missing required fields', async () => {
    const dto: UpdateAvatarThemeDto = { userId: 'u1', avatar: '', theme: '' };
    (service.updateAvatarTheme as jest.Mock).mockImplementation(() => {
      throw new BadRequestException('Missing required fields');
    });
    await expect(controller.updateAvatarTheme(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid enum payloads', async () => {
    const dto: UpdateAvatarThemeDto = { userId: 'u1', avatar: 'invalid', theme: 'invalid' };
    (service.updateAvatarTheme as jest.Mock).mockImplementation(() => {
      throw new BadRequestException('Invalid enum value');
    });
    await expect(controller.updateAvatarTheme(dto)).rejects.toThrow(BadRequestException);
  });

  it('should return ForbiddenException if user is not allowed', async () => {
    const dto: UpdateAvatarThemeDto = { userId: 'u1', avatar: 'hero', theme: 'dark' };
    (service.updateAvatarTheme as jest.Mock).mockImplementation(() => {
      throw new ForbiddenException('Forbidden');
    });
    await expect(controller.updateAvatarTheme(dto)).rejects.toThrow(ForbiddenException);
  });

  it('should only allow current user to update their profile', async () => {
    const dto: UpdateAvatarThemeDto = { userId: 'u1', avatar: 'hero', theme: 'dark' };
    (service.updateAvatarTheme as jest.Mock).mockImplementation((updateDto: UpdateAvatarThemeDto) => {
      if (updateDto.userId !== 'u1') throw new ForbiddenException('Forbidden');
      return 'updated';
    });
    await expect(controller.updateAvatarTheme({ userId: 'u2', avatar: 'hero', theme: 'dark' })).rejects.toThrow(ForbiddenException);
    const result = await controller.updateAvatarTheme(dto);
    expect(result).toBe('updated');
  });

  it('should call service with correct arguments', async () => {
    const dto: UpdateAvatarThemeDto = { userId: 'u1', avatar: 'hero', theme: 'dark' };
    (service.updateAvatarTheme as jest.Mock).mockResolvedValue('updated');
    await controller.updateAvatarTheme(dto);
    expect(service.updateAvatarTheme).toHaveBeenCalledWith(dto);
  });

  it('should create and list quests for a user', async () => {
    (service.createQuest as jest.Mock).mockResolvedValue({ id: 'q1', userId: 'u1', title: 'Test', lifeArea: 'health', status: 'pending', progress: 0 });
    (service.getQuests as jest.Mock).mockResolvedValue([{ id: 'q1', userId: 'u1', title: 'Test', lifeArea: 'health', status: 'pending', progress: 0 }]);

    const created = await controller.createQuest('u1', {
      userId: 'u1',
      title: 'Test',
      lifeArea: 'health',
      status: 'pending',
      progress: 0,
    } as any);
    expect(created).toMatchObject({ id: 'q1', title: 'Test' });

    const list = await controller.getQuests('u1');
    expect(list).toHaveLength(1);
    expect(list[0].lifeArea).toBe('health');
  });

  it('should update a quest', async () => {
    (service.updateQuest as jest.Mock).mockResolvedValue({ id: 'q1', userId: 'u1', title: 'Test', lifeArea: 'health', status: 'complete', progress: 100 });
    const updated = await controller.updateQuest('u1', 'q1', { status: 'complete', progress: 100 } as any);
    expect(updated.status).toBe('complete');
    expect(service.updateQuest).toHaveBeenCalledWith('u1', 'q1', { status: 'complete', progress: 100 });
  });

  it('should log activity and return world state', async () => {
    const mockState = { seed: 42, color: 'green', icon: '⚡', progress: 42 };
    (service.logActivity as jest.Mock).mockResolvedValue(mockState);
    const state = await controller.logActivity('u1', { userId: 'u1', activityType: 'exercise', intensity: 5 } as any);
    expect(state).toEqual(mockState);
    expect(service.logActivity).toHaveBeenCalledWith('u1', 'exercise', 5);
  });

  it('should get world state', async () => {
    const mockState = { seed: 10, color: 'blue', icon: '🌟', progress: 10 };
    (service.getWorldState as jest.Mock).mockResolvedValue(mockState);
    const state = await controller.getWorldState('u1');
    expect(state).toEqual(mockState);
  });
});
// ...existing code...
