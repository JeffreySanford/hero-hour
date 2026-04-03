import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { TelemetryEvent } from '@org/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class TelemetryService {
  constructor(private readonly http: HttpClient) {}

  getTelemetryEvents(): Observable<TelemetryEvent[]> {
    return this.http.get<TelemetryEvent[]>('/api/telemetry');
  }

  listTelemetryEvents(type?: string, userId?: string): Observable<TelemetryEvent[]> {
    const params: any = {};
    if (type) params.type = type;
    if (userId) params.userId = userId;
    return this.http.get<TelemetryEvent[]>('/api/telemetry', { params });
  }
}
