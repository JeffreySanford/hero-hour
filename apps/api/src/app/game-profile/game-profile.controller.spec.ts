import { Test, TestingModule } from '@nestjs/testing';
import { GameProfileController } from './game-profile.controller';
import { GameProfileService } from './game-profile.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UpdateAvatarThemeDto } from './game-profile.dto';

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
  });
// ...existing code...
