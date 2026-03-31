import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LifeProfile {
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: 'leader' | 'member' | 'observer';
}

@Injectable({
  providedIn: 'root',
})
export class LifeProfileService {
  constructor(private readonly http: HttpClient) {}

  save(profile: LifeProfile): Observable<LifeProfile> {
    return this.http.post<LifeProfile>('/api/life-profile', profile);
  }
}
