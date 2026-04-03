import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import type { TelemetryEvent, TelemetryEventType, TelemetryEventPayload } from '@org/api-interfaces';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  list(@Query('type') type?: TelemetryEventType, @Query('userId') userId?: string): TelemetryEvent[] {
    return this.telemetryService.list(type, userId);
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
