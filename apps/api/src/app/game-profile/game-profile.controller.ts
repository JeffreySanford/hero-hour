import { Controller, Get, Patch, Post, Put, Body, Param, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { GameProfileService } from './game-profile.service';
import { UpdateAvatarThemeDto, CreateQuestDto, UpdateQuestDto, ActivityDto } from './game-profile.dto';
import { Quest, SideQuest } from './game-profile.types';

@Controller('game-profile')
@UseGuards(JwtGuard)
export class GameProfileController {
  constructor(private readonly service: GameProfileService) {}

  @Post(':userId/quests')
  async createQuest(@Param('userId') userId: string, @Body() dto: CreateQuestDto): Promise<Quest> {
    if (!userId) throw new BadRequestException('Missing userId');
    if (!dto.title || !dto.lifeArea || dto.progress === undefined || !dto.status) {
      throw new BadRequestException('Missing required quest fields');
    }
    return this.service.createQuest(userId, {
      title: dto.title,
      lifeArea: dto.lifeArea,
      status: dto.status,
      progress: dto.progress,
    });
  }

  @Get(':userId/quests')
  async getQuests(@Param('userId') userId: string): Promise<Quest[]> {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getQuests(userId);
  }

  @Put(':userId/quests/:questId')
  async updateQuest(@Param('userId') userId: string, @Param('questId') questId: string, @Body() dto: UpdateQuestDto): Promise<Quest> {
    if (!userId || !questId) throw new BadRequestException('Missing required quest identifiers');
    try {
      return await this.service.updateQuest(userId, questId, dto);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }

  @Post(':userId/activity')
  async logActivity(@Param('userId') userId: string, @Body() dto: ActivityDto) {
    if (!userId || !dto.activityType || !dto.intensity) {
      throw new BadRequestException('Missing activity data');
    }
    return this.service.logActivity(userId, dto.activityType, dto.intensity);
  }

  @Get(':userId/side-quests')
  async getSideQuests(@Param('userId') userId: string): Promise<SideQuest[]> {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getSideQuests(userId);
  }

  @Post(':userId/side-quests/:sideQuestId/claim')
  async claimSideQuest(@Param('userId') userId: string, @Param('sideQuestId') sideQuestId: string): Promise<SideQuest> {
    if (!userId || !sideQuestId) throw new BadRequestException('Missing required IDs');
    try {
      return await this.service.claimSideQuest(userId, sideQuestId);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }

  @Get(':userId/world-state')
  async getWorldState(@Param('userId') userId: string) {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getWorldState(userId);
  }

  @Get(':userId')
  async getMyProfile(@Param('userId') userId: string) {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getProfile(userId);
  }

  @Patch('avatar-theme')
  async updateAvatarTheme(@Body() dto: UpdateAvatarThemeDto) {
    if (!dto.userId || (!dto.avatar && !dto.theme)) {
      throw new BadRequestException('Missing required fields');
    }
    return this.service.updateAvatarTheme(dto);
  }
}
