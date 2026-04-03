import { IsString, IsArray, IsObject, IsNumber, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import type { LifeRole, PrivacySetting } from '@org/api-interfaces';

const roleValues = ['leader', 'member', 'observer', 'parent', 'worker', 'student', 'athlete'] as const;
const privacyValues = ['private', 'friends', 'workspace', 'public'] as const;

export class CreateLifeProfileDto {
  @IsString()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsNumber()
  age!: number;

  @IsString()
  @IsIn(roleValues)
  preferredRole!: LifeRole;

  @IsOptional()
  @IsArray()
  roles?: LifeRole[];

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsOptional()
  @IsArray()
  priorities?: string[];

  @IsOptional()
  @IsArray()
  frictionPoints?: string[];

  @IsOptional()
  @IsArray()
  habitAnchors?: string[];

  @IsOptional()
  @IsIn(privacyValues)
  privacy?: PrivacySetting;
}

export class UpdateLifeRolesDto {
  @IsString()
  userId!: string;

  @IsArray()
  roles!: LifeRole[];
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
