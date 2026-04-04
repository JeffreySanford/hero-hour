import { AGGREGATE_TELEMETRY_METRICS } from './telemetry-metrics';

describe('Telemetry aggregate metrics', () => {
  it('should define a focused initial set of aggregate metrics', () => {
    expect(AGGREGATE_TELEMETRY_METRICS).toHaveLength(5);

    const metricNames = AGGREGATE_TELEMETRY_METRICS.map((metric) => metric.name);
    expect(metricNames).toEqual([
      'Weekly challenge start rate',
      'Weekly challenge completion rate',
      'Dashboard return rate after re-entry guidance exposure',
      'Side quest completion frequency',
      'Life profile completion and update rate',
    ]);
  });

  it('should link each aggregate metric to supported telemetry event types', () => {
    for (const metric of AGGREGATE_TELEMETRY_METRICS) {
      expect(metric.description).toBeTruthy();
      expect(metric.eventTypes.length).toBeGreaterThan(0);
      for (const eventType of metric.eventTypes) {
        expect(typeof eventType).toBe('string');
      }
    }
  });
});
