import { Controller, Body, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { LifeProfileService } from './life-profile.service';
import type { LifeProfileRequest } from '@org/api-interfaces';
import { CreateLifeProfileDto, UpdateLifeRolesDto, UpdateScheduleDto, SaveHabitAnchorsDto } from './life-profile.dto';

@Controller('life-profile')
export class LifeProfileController {
	constructor(private readonly service: LifeProfileService) {}

	@Post()
	async createRoot(@Body() dto: CreateLifeProfileDto) {
		return this.create(dto);
	}

	@Post('create')
	async create(@Body() dto: CreateLifeProfileDto) {
		if (!dto || !dto.userId || !dto.firstName || !dto.lastName || dto.age === undefined || !dto.preferredRole) {
			throw new Error('Missing required life-profile fields');
		}

		const payload: LifeProfileRequest = {
			userId: dto.userId,
			firstName: dto.firstName,
			lastName: dto.lastName,
			age: dto.age,
			preferredRole: dto.preferredRole,
			roles: dto.roles ?? [],
			schedule: dto.schedule ?? {},
			priorities: dto.priorities ?? [],
			frictionPoints: dto.frictionPoints ?? [],
			habitAnchors: dto.habitAnchors ?? [],
			privacy: dto.privacy ?? 'private',
		};

		return this.service.createProfile(dto.userId, payload);
	}

	@Get(':userId')
	async get(@Param('userId') userId: string) {
		const profile = this.service.getProfile(userId);
		if (!profile) {
			throw new NotFoundException('Life profile not found');
		}
		return profile;
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
