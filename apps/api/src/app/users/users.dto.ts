import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsOptional()
  roles?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  roles?: string[];
}
