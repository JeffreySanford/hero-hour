import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
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
  userId!: string;

  @IsString()
  title!: string;

  @IsEnum(LifeArea)
  lifeArea!: LifeArea;

  @IsEnum(QuestStatus)
  status!: QuestStatus;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress!: number;
}

export class UpdateQuestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(LifeArea)
  lifeArea?: LifeArea;

  @IsOptional()
  @IsEnum(QuestStatus)
  status?: QuestStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;
}

export class ActivityDto {
  @IsString()
  userId!: string;

  @IsString()
  activityType!: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  intensity!: number;
}
