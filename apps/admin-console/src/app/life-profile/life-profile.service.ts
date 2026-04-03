import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import type { LifeProfile, VillageState } from '@org/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class LifeProfileService {
  constructor(private readonly http: HttpClient) {}

  save(profile: LifeProfile): Observable<LifeProfile> {
    return this.http.post<LifeProfile>('/api/life-profile', profile);
  }

  get(userId: string): Observable<LifeProfile> {
    return this.http.get<LifeProfile>(`/api/life-profile/${encodeURIComponent(userId)}`);
  }

  getVillageState(userId: string): Observable<VillageState> {
    return this.http
      .get<VillageState>(`/api/game-profile/${encodeURIComponent(userId)}/village`)
      .pipe(
        catchError(() =>
          of({
            structures: [],
            totalProgress: 0,
            updatedAt: new Date().toISOString(),
          } as VillageState)
        )
      );
  }
}
