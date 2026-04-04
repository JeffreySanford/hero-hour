import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import type { FeatureFlagName, FeatureFlagUpdate, FeatureFlags } from '@org/api-interfaces';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get()
  list(): FeatureFlags {
    return this.featureFlagsService.list();
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() body: FeatureFlagUpdate): FeatureFlags {
    return this.featureFlagsService.set(body.name as FeatureFlagName, body.enabled);
  }
}
