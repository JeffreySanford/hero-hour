import { IsString, IsArray, IsObject } from 'class-validator';

export class CreateLifeProfileDto {
  @IsString()
  userId!: string;
}

export class UpdateLifeRolesDto {
  @IsString()
  userId!: string;
  @IsArray()
  roles!: string[];
}

export class UpdateScheduleDto {
  @IsString()
  userId!: string;
  @IsObject()
  schedule!: Record<string, any>;
}

export class SaveHabitAnchorsDto {
  @IsString()
  userId!: string;
  @IsArray()
  anchors!: string[];
}
