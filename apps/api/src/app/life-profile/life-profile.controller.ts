import { Controller, Body, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LifeProfileService } from './life-profile.service';
import { CreateLifeProfileDto, UpdateLifeRolesDto, UpdateScheduleDto, SaveHabitAnchorsDto } from './life-profile.dto';

@Controller('life-profile')
export class LifeProfileController {
	constructor(private readonly service: LifeProfileService) {}

	@Post('create')
	async create(@Body() dto: CreateLifeProfileDto) {
			return this.service.create(dto);
	}

	@Put('roles')
	async updateRoles(@Body() dto: UpdateLifeRolesDto) {
			return this.service.updateRoles(dto);
	}

	@Put('schedule')
	async updateSchedule(@Body() dto: UpdateScheduleDto) {
			return this.service.updateSchedule(dto);
	}

	@Put('habit-anchors')
	async saveHabitAnchors(@Body() dto: SaveHabitAnchorsDto) {
			return this.service.saveHabitAnchors(dto);
	}

	@Post('me')
	async getMyProfile(@Req() req: any) {
			if (!req.user || !req.user.id) throw new Error('Missing user');
			return this.service.getProfile(req.user.id);
	}
}
