import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingStepDto, CompleteOnboardingDto } from './onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
	constructor(private readonly service: OnboardingService) {}

	@Post('step')
	async saveStep(@Body() dto: OnboardingStepDto) {
		if (!dto.userId || !dto.stepName) throw new BadRequestException('Missing required fields');
		// Optionally validate stepName enum
		return this.service.saveStep(dto.userId, { type: dto.stepName, data: dto.payload });
	}

	@Get('state/:userId')
	async getState(@Param('userId') userId: string) {
		if (!userId) throw new BadRequestException('Missing userId');
		return this.service.getOnboarding(userId);
	}

	@Post('complete')
	async complete(@Body() dto: CompleteOnboardingDto) {
		if (!dto.userId) throw new BadRequestException('Missing userId');
		return this.service.completeOnboarding(dto.userId);
	}
}
