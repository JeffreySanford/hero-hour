import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { concatMap, filter, finalize, map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export type OfflineActionType = 'create-quest' | 'log-activity';

export interface OfflineAction {
  type: OfflineActionType;
  payload: any;
}

const OFFLINE_QUEUE_KEY = 'admin-console-offline-queue';

@Injectable({ providedIn: 'root' })
export class OfflineService {
  private onlineSubject = new BehaviorSubject<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly online$ = this.onlineSubject.asObservable();

  private syncingSubject = new BehaviorSubject<boolean>(false);
  readonly syncing$ = this.syncingSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.setOnline(true));
      window.addEventListener('offline', () => this.setOnline(false));
    }

    this.online$.pipe(filter((online) => online)).subscribe(() => {
      this.syncQueue().subscribe({});
    });
  }

  isOnline(): boolean {
    return this.onlineSubject.value;
  }

  getStatus(): 'online' | 'offline' | 'syncing' {
    if (this.syncingSubject.value) {
      return 'syncing';
    }
    return this.isOnline() ? 'online' : 'offline';
  }

  enqueue(action: OfflineAction): void {
    const list = this.getQueue();
    list.push(action);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(list));
  }

  getQueue(): OfflineAction[] {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  clearQueue(): void {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  }

  syncQueue(): Observable<void> {
    const queue = this.getQueue();
    if (queue.length === 0) {
      return of(undefined);
    }

    this.syncingSubject.next(true);

    return from(queue).pipe(
      concatMap((action) => {
        switch (action.type) {
          case 'create-quest':
            return this.http.post('/api/game-profile/' + encodeURIComponent(action.payload.userId) + '/quests', action.payload.quest).pipe(map(() => undefined));
          case 'log-activity':
            return this.http.post('/api/game-profile/' + encodeURIComponent(action.payload.userId) + '/activity', action.payload.activity).pipe(map(() => undefined));
          default:
            return of(undefined);
        }
      }),
      take(queue.length),
      finalize(() => {
        this.clearQueue();
        this.syncingSubject.next(false);
      })
    );
  }

  getPendingCount(): number {
    return this.getQueue().length;
  }

  private setOnline(status: boolean): void {
    this.onlineSubject.next(status);
  }
}
