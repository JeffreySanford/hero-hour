import { Controller, Get, Patch, Body, Param, BadRequestException } from '@nestjs/common';
import { GameProfileService } from './game-profile.service';
import { UpdateAvatarThemeDto } from './game-profile.dto';

@Controller('game-profile')
export class GameProfileController {
  constructor(private readonly service: GameProfileService) {}

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
    // Optionally validate enums here
    return this.service.updateAvatarTheme(dto);
  }
}
