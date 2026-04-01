import { Controller, Body, Get, Param, Post, Put, Patch, HttpCode, HttpStatus, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { LifeProfileService } from './life-profile/life-profile.service';
import { CreateLifeProfileDto, UpdateLifeRolesDto, UpdateScheduleDto, SaveHabitAnchorsDto } from './life-profile/life-profile.dto';

@Controller('life-profile')
export class LifeProfileController {
  constructor(private readonly service: LifeProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateLifeProfileDto) {
    console.log('[API] life-profile POST hit', { body: dto });
    if (!dto || !dto.userId || !dto.firstName || !dto.lastName || !dto.age || !dto.preferredRole) {
      console.log('[API] life-profile POST missing required fields', { body: dto });
      throw new BadRequestException('Missing required life-profile fields: userId, firstName, lastName, age, preferredRole');
    }

    try {
      return await this.service.createProfile(dto.userId, dto as any);
    } catch (err: any) {
      if (err.message.includes('Missing')) {
        throw new BadRequestException(err.message);
      }
      if (err.message.includes('exists') || err.message.includes('already exists')) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
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

  @Patch()
  async patch(@Body() dto: CreateLifeProfileDto) {
    return this.service.updateProfile(dto.userId, dto as any);
  }

  @Post('me')
  async getMyProfile(req: any) {
    if (!req.user || !req.user.id) throw new Error('Missing user');
    return this.service.getProfile(req.user.id);
  }
}

