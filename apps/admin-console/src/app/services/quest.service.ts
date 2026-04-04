import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfflineService } from './offline.service';
import { Quest, WorldState, SideQuest, WeeklyChallenge } from '@org/api-interfaces';

export enum SideQuestType {
  QUICK_WIN = 'quick-win',
  DAILY = 'daily',
  BONUS = 'bonus',
}

@Injectable({ providedIn: 'root' })
export class QuestService {
  constructor(private readonly http: HttpClient, private readonly offlineService: OfflineService) {}

  getQuests(userId: string): Observable<Quest[]> {
    return this.http.get<Quest[]>(`/api/game-profile/${encodeURIComponent(userId)}/quests`);
  }

  createQuest(userId: string, quest: Omit<Quest, 'id' | 'userId'>): Observable<Quest> {
    if (!this.offlineService.isOnline()) {
      this.offlineService.enqueue({
        type: 'create-quest',
        payload: {
          userId,
          quest,
        },
      });

      const fallback: Quest = {
        id: `offline-${Date.now()}`,
        userId,
        ...quest,
      };
      return of(fallback);
    }

    return this.http.post<Quest>(`/api/game-profile/${encodeURIComponent(userId)}/quests`, {
      ...quest,
      userId,
    });
  }

  updateQuest(userId: string, questId: string, updates: Partial<Omit<Quest, 'id' | 'userId'>>): Observable<Quest> {
    return this.http.put<Quest>(`/api/game-profile/${encodeURIComponent(userId)}/quests/${encodeURIComponent(questId)}`, updates);
  }

  completeQuest(userId: string, questId: string): Observable<Quest> {
    if (!this.offlineService.isOnline()) {
      this.offlineService.enqueueUpdateQuest(userId, questId, { status: 'complete', progress: 100 });
      return of({
        id: questId,
        userId,
        title: '',
        lifeArea: 'career',
        status: 'complete',
        progress: 100,
      } as Quest);
    }

    return this.http
      .post<{ quest: Quest; worldState: WorldState; profile: any }>(`/api/game-profile/${encodeURIComponent(userId)}/quests/${encodeURIComponent(questId)}/complete`, {})
      .pipe(map((result) => result.quest));
  }

  logActivity(userId: string, activityType: string, intensity: number): Observable<WorldState> {
    if (!this.offlineService.isOnline()) {
      this.offlineService.enqueue({
        type: 'log-activity',
        payload: {
          userId,
          activity: {
            userId,
            activityType,
            intensity,
          },
        },
      });

      return of({
        seed: 0,
        color: 'gray',
        icon: '⏳',
        progress: 0,
      });
    }

    return this.http.post<WorldState>(`/api/game-profile/${encodeURIComponent(userId)}/activity`, {
      userId,
      activityType,
      intensity,
    });
  }

  getWorldState(userId: string): Observable<WorldState> {
    return this.http.get<WorldState>(`/api/game-profile/${encodeURIComponent(userId)}/world-state`);
  }

  getSideQuests(userId: string): Observable<SideQuest[]> {
    return this.http.get<SideQuest[]>(`/api/game-profile/${encodeURIComponent(userId)}/side-quests`);
  }

  getWeeklyChallenges(userId: string): Observable<WeeklyChallenge[]> {
    return this.http.get<WeeklyChallenge[]>(`/api/game-profile/${encodeURIComponent(userId)}/weekly-challenges`);
  }

  createWeeklyChallenge(userId: string, challenge: Omit<WeeklyChallenge, 'id' | 'userId' | 'status'>): Observable<WeeklyChallenge> {
    return this.http.post<WeeklyChallenge>(`/api/game-profile/${encodeURIComponent(userId)}/weekly-challenges`, {
      ...challenge,
      userId,
    });
  }

  claimSideQuest(userId: string, sideQuestId: string): Observable<SideQuest> {
    return this.http.post<SideQuest>(`/api/game-profile/${encodeURIComponent(userId)}/side-quests/${encodeURIComponent(sideQuestId)}/claim`, {});
  }
}
