import { IsString, IsOptional, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { LifeArea, QuestStatus } from './game-profile.types';

export class UpdateAvatarThemeDto {
  @IsString()
  userId!: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  theme?: string;
}

export class CreateQuestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(LifeArea)
  lifeArea!: LifeArea;

  @IsEnum(QuestStatus)
  status!: QuestStatus;

  @IsNumber()
  progress!: number;
}

export class UpdateQuestDto {
  @IsEnum(QuestStatus)
  status!: QuestStatus;

  @IsNumber()
  progress!: number;
}

export class ActivityDto {
  @IsString()
  @IsNotEmpty()
  activityType!: string;

  @IsNumber()
  intensity!: number;
}

export class FocusSessionDto {
  @IsNumber()
  durationMinutes!: number;

  @IsString()
  @IsNotEmpty()
  focusArea!: string;
}

