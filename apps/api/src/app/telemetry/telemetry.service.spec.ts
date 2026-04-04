import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { TelemetryAuditRepository } from '@org/domain';

describe('TelemetryService', () => {
  let service: TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryService, TelemetryAuditRepository],
    }).compile();
    service = module.get<TelemetryService>(TelemetryService);
    service.clear();
  });

  it('should record and list telemetry events', () => {
    const event = service.record({
      type: 'lifeProfileUpdated',
      userId: 'user1',
      payload: { userId: 'user1', details: {}, source: 'backend' },
    });
    expect(event.id).toBeDefined();
    expect(event.type).toBe('lifeProfileUpdated');
    expect(event.payload.source).toBe('backend');
    expect(event.payload.sessionId).toBeDefined();

    const all = service.list();
    expect(all).toHaveLength(1);

    const filtered = service.list('lifeProfileUpdated', 'user1');
    expect(filtered).toHaveLength(1);
  });

  it('should support analytics count for challengeCompleted', () => {
    service.record({
      type: 'challengeCompleted',
      userId: 'user1',
      payload: { userId: 'user1', details: { challengeId: 'c1' }, source: 'backend' },
    });
    service.record({
      type: 'challengeCompleted',
      userId: 'user1',
      payload: { userId: 'user1', details: { challengeId: 'c2' }, source: 'backend' },
    });

    const completed = service.list('challengeCompleted', 'user1');
    expect(completed).toHaveLength(2);
  });
});