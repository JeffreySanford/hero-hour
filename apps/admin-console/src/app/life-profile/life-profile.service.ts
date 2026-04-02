import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { LifeProfile } from '@org/api-interfaces';

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
}
