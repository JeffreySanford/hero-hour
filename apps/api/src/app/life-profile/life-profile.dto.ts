import { IsString, IsArray, IsObject, IsNumber, IsIn, IsNotEmpty } from 'class-validator';

const roleValues = ['leader', 'member', 'observer'] as const;

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
  preferredRole!: typeof roleValues[number];
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
