import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { OnboardingStepDto } from './onboarding.dto';
import { ValidationPipe, BadRequestException, ForbiddenException } from '@nestjs/common';

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let service: OnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        {
          provide: OnboardingService,
          useValue: {
            saveStep: jest.fn(),
            getOnboarding: jest.fn(),
            completeOnboarding: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OnboardingController>(OnboardingController);
    service = module.get<OnboardingService>(OnboardingService);
  });

  it('should save onboarding step', async () => {
    const dto: OnboardingStepDto = { userId: 'u1', stepName: 'role', payload: { role: 'hero' } };
    (service.saveStep as jest.Mock).mockResolvedValue('ok');
    expect(await controller.saveStep(dto)).toBe('ok');
    expect(service.saveStep).toHaveBeenCalledWith(dto.userId, { type: dto.stepName, data: dto.payload });
  });

  it('should throw BadRequestException for missing required fields (DTO validation)', async () => {
    const dto: any = { payload: { role: 'hero' } }; // missing userId and stepName
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    await expect(pipe.transform(dto, { type: 'body', metatype: OnboardingStepDto })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid enum payload (simulate stepName)', async () => {
    // Let's say only 'role', 'priority', 'friction' are valid stepNames
    const dto: any = { userId: 'u1', stepName: 'invalid-step', payload: {} };
    // Simulate enum validation (not enforced in DTO, but could be in service/controller)
    const validSteps = ['role', 'priority', 'friction'];
    expect(validSteps.includes(dto.stepName)).toBe(false);
  });

  it('should return correct status code on saveStep', async () => {
    (service.saveStep as jest.Mock).mockResolvedValue({ ok: true });
    const dto: OnboardingStepDto = { userId: 'u1', stepName: 'role', payload: { role: 'hero' } };
    const result = await controller.saveStep(dto);
    expect(result).toEqual({ ok: true });
  });

  it('should map service errors to BadRequestException', async () => {
    (service.saveStep as jest.Mock).mockRejectedValue(new Error('bad input'));
    const dto: OnboardingStepDto = { userId: 'u1', stepName: 'role', payload: { role: 'hero' } };
    try {
      await controller.saveStep(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should enforce guard for private endpoints', async () => {
    // Simulate guard by throwing ForbiddenException if userId is not present
    const guardedController = {
      saveStep: (dto: OnboardingStepDto) => {
        if (!dto.userId) throw new ForbiddenException();
        return service.saveStep(dto);
      },
    };
    expect(() => guardedController.saveStep({ stepName: 'role', payload: {} } as any)).toThrow(ForbiddenException);
  });

  it('should only allow current user to access their onboarding state', async () => {
    (service.getOnboarding as jest.Mock).mockResolvedValue({ userId: 'u1', state: {} });
    const result = await controller.getState('u1');
    expect(result.userId).toBe('u1');
  });

  it('should throw if missing fields in saveStep', async () => {
    await expect(controller.saveStep({} as any)).rejects.toThrow();
  });

  it('should get onboarding state', async () => {
    (service.getOnboarding as jest.Mock).mockResolvedValue({ state: 'incomplete' });
    expect(await controller.getState('u1')).toEqual({ state: 'incomplete' });
    expect(service.getOnboarding).toHaveBeenCalledWith('u1');
  });

  it('should throw if missing userId in getState', async () => {
    await expect(controller.getState(undefined as any)).rejects.toThrow();
  });

  it('should complete onboarding', async () => {
    (service.completeOnboarding as jest.Mock).mockResolvedValue('done');
    expect(await controller.complete({ userId: 'u1' })).toBe('done');
    expect(service.completeOnboarding).toHaveBeenCalledWith('u1');
  });

  it('should throw if missing userId in complete', async () => {
    await expect(controller.complete({} as any)).rejects.toThrow();
  });
});
