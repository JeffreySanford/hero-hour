import { IsString, IsOptional, IsObject } from 'class-validator';

export class OnboardingStepDto {
  @IsString()
  userId: string;

  @IsString()
  stepName: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;
}

export class CompleteOnboardingDto {
  @IsString()
  userId: string;
}
