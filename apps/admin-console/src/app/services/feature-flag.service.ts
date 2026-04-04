import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { FeatureFlagName, FeatureFlags, FeatureFlagUpdate } from '@org/api-interfaces';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  constructor(private readonly http: HttpClient) {}

  getFlags(): Observable<FeatureFlags> {
    return this.http.get<FeatureFlags>('/api/feature-flags');
  }

  setFlag(flag: FeatureFlagName, enabled: boolean): Observable<FeatureFlags> {
    return this.http.patch<FeatureFlags>(`/api/feature-flags/${flag}`, { name: flag, enabled } as FeatureFlagUpdate);
  }
}
