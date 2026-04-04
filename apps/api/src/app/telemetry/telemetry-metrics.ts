import type { TelemetryAggregateMetric, TelemetryEventType } from '@org/api-interfaces';

export const AGGREGATE_TELEMETRY_METRICS: TelemetryAggregateMetric[] = [
  {
    name: 'Weekly challenge start rate',
    description: 'Percentage of users who start a weekly challenge after it is assigned.',
    eventTypes: ['challengeAssigned', 'weeklyChallengeCompleted'],
  },
  {
    name: 'Weekly challenge completion rate',
    description: 'Percentage of weekly challenges completed by users who began a challenge.',
    eventTypes: ['weeklyChallengeCompleted'],
  },
  {
    name: 'Dashboard return rate after re-entry guidance exposure',
    description: 'Rate of returning users who revisit the dashboard after guidance is shown.',
    eventTypes: ['dailyBoardViewed', 'strategyProfileViewed'],
  },
  {
    name: 'Side quest completion frequency',
    description: 'Number of side quests completed per user session.',
    eventTypes: ['questCompleted'],
  },
  {
    name: 'Life profile completion and update rate',
    description: 'Share of users who complete or update their life profile.',
    eventTypes: ['lifeProfileUpdated'],
  },
];

export function isTelemetryEventType(value: string): value is TelemetryEventType {
  return AGGREGATE_TELEMETRY_METRICS.some((metric) => metric.eventTypes.includes(value as TelemetryEventType));
}
