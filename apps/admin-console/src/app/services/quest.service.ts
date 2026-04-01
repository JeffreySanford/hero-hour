import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type LifeArea = 'health' | 'career' | 'relationships' | 'fun';
export type QuestStatus = 'pending' | 'complete' | 'failed';

export enum SideQuestType {
  QUICK_WIN = 'quick-win',
  DAILY = 'daily',
  BONUS = 'bonus',
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  lifeArea: LifeArea;
  status: QuestStatus;
  progress: number;
}

export interface SideQuest {
  id: string;
  userId: string;
  title: string;
  type: SideQuestType;
  completed: boolean;
  rewardXp: number;
}

export interface WorldState {
  seed: number;
  color: string;
  icon: string;
  progress: number;
}

@Injectable({ providedIn: 'root' })
export class QuestService {
  constructor(private readonly http: HttpClient) {}

  getQuests(userId: string): Observable<Quest[]> {
    return this.http.get<Quest[]>(`/api/game-profile/${encodeURIComponent(userId)}/quests`);
  }

  createQuest(userId: string, quest: Omit<Quest, 'id' | 'userId'>): Observable<Quest> {
    return this.http.post<Quest>(`/api/game-profile/${encodeURIComponent(userId)}/quests`, {
      ...quest,
      userId,
    });
  }

  updateQuest(userId: string, questId: string, updates: Partial<Omit<Quest, 'id' | 'userId'>>): Observable<Quest> {
    return this.http.put<Quest>(`/api/game-profile/${encodeURIComponent(userId)}/quests/${encodeURIComponent(questId)}`, updates);
  }

  logActivity(userId: string, activityType: string, intensity: number): Observable<WorldState> {
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

  claimSideQuest(userId: string, sideQuestId: string): Observable<SideQuest> {
    return this.http.post<SideQuest>(`/api/game-profile/${encodeURIComponent(userId)}/side-quests/${encodeURIComponent(sideQuestId)}/claim`, {});
  }
}
