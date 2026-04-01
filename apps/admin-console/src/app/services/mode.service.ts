import { Injectable } from '@angular/core';

export type Mode = 'casual' | 'pro';

@Injectable({
  providedIn: 'root',
})
export class ModeService {
  private readonly storageKey = 'hero-hour-mode';
  private mode: Mode = 'casual';

  constructor() {
    this.loadFromStorage();
  }

  getMode(): Mode {
    return this.mode;
  }

  setMode(mode: Mode): void {
    this.mode = mode;
    try {
      localStorage.setItem(this.storageKey, mode);
    } catch {
      // fallback: localStorage may be unavailable in some contexts
    }
  }

  toggleMode(): void {
    this.setMode(this.mode === 'casual' ? 'pro' : 'casual');
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey) as Mode | null;
      if (stored === 'casual' || stored === 'pro') {
        this.mode = stored;
      } else {
        this.mode = 'casual';
      }
    } catch {
      this.mode = 'casual';
    }
  }
}
