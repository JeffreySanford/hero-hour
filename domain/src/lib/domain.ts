import type { TelemetryEvent } from '@org/api-interfaces';

export interface TelemetryAuditRecord extends TelemetryEvent {}

export class TelemetryAuditRepository {
  private readonly storage: TelemetryAuditRecord[] = [];

  save(event: TelemetryEvent): TelemetryAuditRecord {
    const record: TelemetryAuditRecord = { ...event };
    this.storage.push(record);
    return record;
  }

  list(type?: string, userId?: string): TelemetryAuditRecord[] {
    return this.storage.filter((record) => {
      if (type && record.type !== type) return false;
      if (userId && record.userId !== userId) return false;
      return true;
    });
  }

  clear(): void {
    this.storage.length = 0;
  }
}

