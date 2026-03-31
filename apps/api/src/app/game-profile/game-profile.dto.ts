import { IsString, IsOptional } from 'class-validator';

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
