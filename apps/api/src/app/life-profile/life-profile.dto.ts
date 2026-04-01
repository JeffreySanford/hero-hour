import { IsString, IsInt, IsOptional, Min, Max, IsArray, IsObject, IsEnum } from 'class-validator';

export enum LifeRole {
  LEADER = 'leader',
  MEMBER = 'member',
  OBSERVER = 'observer',
}

export class CreateLifeProfileDto {
  @IsString()
  userId!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age!: number;

  @IsEnum(LifeRole)
  preferredRole!: LifeRole;

  @IsArray()
  @IsOptional()
  roles?: string[];

  @IsObject()
  @IsOptional()
  schedule?: Record<string, any>;

  @IsArray()
  @IsOptional()
  priorities?: string[];

  @IsArray()
  @IsOptional()
  frictionPoints?: string[];

  @IsArray()
  @IsOptional()
  habitAnchors?: string[];
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
