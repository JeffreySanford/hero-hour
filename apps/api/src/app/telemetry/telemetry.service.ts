import { Injectable } from '@nestjs/common';
import type { TelemetryEvent } from '@org/api-interfaces';
import { TelemetryAuditRepository } from '@org/domain';

@Injectable()
export class TelemetryService {
  private readonly events: TelemetryEvent[] = [];

  constructor(private readonly auditRepo: TelemetryAuditRepository) {}

  record(event: Omit<TelemetryEvent, 'id' | 'createdAt'>): TelemetryEvent {
    const payload = {
      ...event.payload,
      source: event.payload.source || 'backend',
      sessionId: event.payload.sessionId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      version: event.payload.version || '1.0',
    };

    const telemetry: TelemetryEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...event,
      payload,
    };

    this.events.push(telemetry);
    this.auditRepo.save(telemetry);
    return telemetry;
  }

  list(type?: string, userId?: string): TelemetryEvent[] {
    return this.events.filter((item) => {
      if (type && item.type !== type) return false;
      if (userId && item.userId !== userId) return false;
      return true;
    });
  }

  clear(): void {
    this.events.length = 0;
    this.auditRepo.clear();
  }
}
