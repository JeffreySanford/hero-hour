import { TelemetryAuditRepository } from './domain';

describe('domain', () => {
  it('should store and list telemetry records', () => {
    const repo = new TelemetryAuditRepository();
    expect(repo.list().length).toBe(0);

    const record = repo.save({
      id: 'rec-1',
      type: 'questCompleted',
      userId: 'demo-user',
      payload: { userId: 'demo-user', details: { xp: 100 } },
      createdAt: new Date().toISOString(),
    });

    expect(repo.list().length).toBe(1);
    expect(record.userId).toBe('demo-user');
  });
});
