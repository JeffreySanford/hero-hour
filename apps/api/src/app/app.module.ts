import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { LifeProfileModule } from './life-profile/life-profile.module';
import { GameProfileModule } from './game-profile/game-profile.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { OnboardingService } from './onboarding/onboarding.service';
import { OnboardingController } from './onboarding/onboarding.controller';
import { LifeProfileService } from './life-profile/life-profile.service';
import { LifeProfileController } from './life-profile/life-profile.controller';
import { GameProfileService } from './game-profile/game-profile.service';
import { GameProfileController } from './game-profile/game-profile.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OnboardingModule,
    LifeProfileModule,
    GameProfileModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    OnboardingController,
    LifeProfileController,
    GameProfileController,
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    OnboardingService,
    LifeProfileService,
    GameProfileService,
  ],
})
export class AppModule {}
