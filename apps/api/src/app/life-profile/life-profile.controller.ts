import { Controller, Body, Post, Put } from '@nestjs/common';
import { LifeProfileService } from './life-profile.service';
import { CreateLifeProfileDto, UpdateLifeRolesDto, UpdateScheduleDto, SaveHabitAnchorsDto } from './life-profile.dto';

@Controller('life-profile')
export class LifeProfileController {
	constructor(private readonly service: LifeProfileService) {}

	@Post('create')
	async create(@Body() dto: CreateLifeProfileDto) {
		if (!dto || !dto.userId || !dto.firstName || !dto.lastName || dto.age === undefined || !dto.preferredRole) {
			throw new Error('Missing required life-profile fields');
		}
		return this.service.createProfile(dto.userId, {
			firstName: dto.firstName,
			lastName: dto.lastName,
			age: dto.age,
			preferredRole: dto.preferredRole,
		});
	}

	@Put('roles')
	async updateRoles(@Body() dto: UpdateLifeRolesDto) {
		return this.service.updateRoles(dto.userId, dto.roles);
	}

	@Put('schedule')
	async updateSchedule(@Body() dto: UpdateScheduleDto) {
		return this.service.updateSchedule(dto.userId, dto.schedule);
	}

	@Put('habit-anchors')
	async saveHabitAnchors(@Body() dto: SaveHabitAnchorsDto) {
		return this.service.saveHabitAnchors(dto.userId, dto.anchors);
	}

	@Post('me')
	async getMyProfile(req: any) {
		if (!req.user || !req.user.id) throw new Error('Missing user');
		return this.service.getProfile(req.user.id);
	}
}
