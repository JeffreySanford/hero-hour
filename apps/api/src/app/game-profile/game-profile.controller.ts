import { Controller, Get, Patch, Post, Put, Body, Param, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { GameProfileService } from './game-profile.service';
import { UpdateAvatarThemeDto, CreateQuestDto, UpdateQuestDto, ActivityDto, FocusSessionDto } from './game-profile.dto';
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

  @Get(':userId/weekly-challenges')
  async getWeeklyChallenges(@Param('userId') userId: string) {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getWeeklyChallenges(userId);
  }

  @Post(':userId/weekly-challenges')
  async createWeeklyChallenge(@Param('userId') userId: string, @Body() payload: any) {
    if (!userId || !payload?.title || !payload?.target || !payload?.rewardXp) {
      throw new BadRequestException('Missing challenge fields');
    }
    return this.service.createWeeklyChallenge(userId, {
      title: payload.title,
      description: payload.description || 'Weekly challenge goal',
      target: payload.target,
      progress: payload.progress ?? 0,
      rewardXp: payload.rewardXp,
      startDate: payload.startDate ?? new Date().toISOString(),
      endDate: payload.endDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  @Put(':userId/weekly-challenges/:challengeId/complete')
  async completeWeeklyChallenge(@Param('userId') userId: string, @Param('challengeId') challengeId: string) {
    if (!userId || !challengeId) throw new BadRequestException('Missing identifiers');
    const challenges = await this.service.getWeeklyChallenges(userId);
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    if (challenge.status !== 'active') {
      return challenge;
    }
    challenge.status = 'complete';
    challenge.progress = challenge.target;
    await this.service.updateProfile(userId, { xp: (await this.service.getProfile(userId)).xp + challenge.rewardXp });
    return challenge;
  }

  @Put(':userId/quests/:questId')
  async updateQuest(@Param('userId') userId: string, @Param('questId') questId: string, @Body() dto: UpdateQuestDto): Promise<Quest> {
    if (!userId || !questId) throw new BadRequestException('Missing required quest identifiers');
    try {
      return await this.service.updateQuest(userId, questId, dto);
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        throw new NotFoundException(err.message);
      }
      if (err.message?.includes('Invalid quest status') || err.message?.includes('progress must be between')) {
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException(err.message || 'Invalid quest update request');
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

  @Get(':userId/strategy-profile')
  async getStrategyProfile(@Param('userId') userId: string) {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getStrategyProfile(userId);
  }

  @Post(':userId/quests/:questId/complete')
  async completeQuest(@Param('userId') userId: string, @Param('questId') questId: string) {
    if (!userId || !questId) throw new BadRequestException('Missing required quest identifiers');
    try {
      return await this.service.completeQuest(userId, questId);
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        throw new NotFoundException(err.message);
      }
      throw new BadRequestException(err.message || 'Invalid quest complete request');
    }
  }

  @Post(':userId/focus-sessions')
  async completeFocusSession(@Param('userId') userId: string, @Body() dto: FocusSessionDto) {
    if (!userId || dto.durationMinutes <= 0 || !dto.focusArea) {
      throw new BadRequestException('Missing focus session data');
    }
    return this.service.completeFocusSession(userId, dto.durationMinutes, dto.focusArea);
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
