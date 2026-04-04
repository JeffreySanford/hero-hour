import { Injectable } from '@nestjs/common';
import type { FeatureFlagName, FeatureFlags } from '@org/api-interfaces';

@Injectable()
export class FeatureFlagsService {
  private flags: FeatureFlags = {
    weeklyChallenges: true,
    strategyProfile: true,
    reentryGuidance: true,
    richerProgression: false,
  };

  isEnabled(name: FeatureFlagName): boolean {
    return !!this.flags[name];
  }

  list(): FeatureFlags {
    return { ...this.flags };
  }

  set(name: FeatureFlagName, enabled: boolean): FeatureFlags {
    this.flags[name] = enabled;
    return this.list();
  }
}