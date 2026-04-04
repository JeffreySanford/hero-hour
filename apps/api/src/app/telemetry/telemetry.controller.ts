import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import type { TelemetryEvent, TelemetryEventType, TelemetryEventPayload, TelemetryAggregateMetric } from '@org/api-interfaces';
import { AGGREGATE_TELEMETRY_METRICS } from './telemetry-metrics';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  list(@Query('type') type?: TelemetryEventType, @Query('userId') userId?: string): TelemetryEvent[] {
    return this.telemetryService.list(type, userId);
  }

  @Get('metrics')
  metrics(): TelemetryAggregateMetric[] {
    return AGGREGATE_TELEMETRY_METRICS;
  }

  @Post('clear')
  clear(): string {
    this.telemetryService.clear();
    return 'cleared';
  }

  @Post('record')
  record(@Body() payload: { type: TelemetryEventType; userId: string; eventPayload: TelemetryEventPayload }): TelemetryEvent {
    return this.telemetryService.record({ type: payload.type, userId: payload.userId, payload: payload.eventPayload });
  }
}
