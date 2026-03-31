import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
}

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(private readonly http: HttpClient) {}

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/api/health');
  }
}
