import { Component, OnInit, OnDestroy } from '@angular/core';
import { HealthService } from '../services/health.service';
import type { HealthResponse, TelemetryEvent } from '@org/api-interfaces';
import { QuestService, Quest, LifeArea, WorldState, SideQuest } from '../services/quest.service';
import { OfflineService } from '../services/offline.service';
import { AuthService } from '../services/auth.service';
import { TelemetryService } from '../services/telemetry.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  status?: string;
  error = false;
  readonly userId = 'demo-user';

  offlineStatus: 'online' | 'offline' | 'syncing' = 'online';

  quests: Quest[] = [];
  sideQuests: SideQuest[] = [];
  newQuestTitle = '';
  newQuestArea: LifeArea = 'health';
  worldState: WorldState = { seed: 0, color: 'gray', icon: '⏳', progress: 0 };
  selectedActivity = localStorage.getItem('hero-hour-selected-activity') || '';
  darkMode = false;
  telemetryEvents: TelemetryEvent[] = [];
  isLoadingTelemetry = true;
  recentlyCompletedQuestId: string | null = null;
  recentlyClaimedSideQuestId: string | null = null;
  isReducedMotion = false;
  private completionAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  private reducedMotionMediaQuery: MediaQueryList | null = null;

  // Central animation trigger for completion/claim states. This helper keeps timing logic in one place
  // and allows tests to assert animation state without needing to duplicate timeout cleanup logic.
  activateCompletionAnimation(questId?: string, sideQuestId?: string, timeout = 1600): void {
    if (this.completionAnimationTimer) {
      clearTimeout(this.completionAnimationTimer);
      this.completionAnimationTimer = null;
    }

    if (questId) {
      this.recentlyCompletedQuestId = questId;
    }
    if (sideQuestId) {
      this.recentlyClaimedSideQuestId = sideQuestId;
    }

    const effectiveTimeout = this.isReducedMotion ? 300 : timeout;

    this.completionAnimationTimer = setTimeout(() => {
      if (questId) {
        this.recentlyCompletedQuestId = null;
      }
      if (sideQuestId) {
        this.recentlyClaimedSideQuestId = null;
      }
      this.completionAnimationTimer = null;
    }, effectiveTimeout);
  }

  availableQuestSuggestions = [
    { title: 'Prepare quarterly roadmap', lifeArea: 'career' },
    { title: 'Run cross-team design review', lifeArea: 'career' },
    { title: 'Prototype customer onboarding flow', lifeArea: 'product' },
    { title: 'Schedule sprint retrospective', lifeArea: 'team' },
    { title: 'Create personal daily standup ritual', lifeArea: 'health' },
    { title: 'Finish article on DevOps efficiency', lifeArea: 'education' },
  ];
  formError = '';
  profileMenuOpen = false;
  userInitials = '??';

  isLoadingHealth = true;
  isLoadingQuests = true;
  isLoadingSideQuests = true;
  isLoadingWorldState = true;

  dailyGridCells: Array<{ index: number; activity?: 'work' | 'exercise' | 'social' | 'rest'; completed: boolean }> = [];

  constructor(
    private readonly healthService: HealthService,
    private readonly questService: QuestService,
    private readonly offlineService: OfflineService,
    private readonly authService: AuthService,
    private readonly telemetryService: TelemetryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.darkMode = localStorage.getItem('hero-hour-dark-mode') === 'true';
    this.applyDarkMode();

    this.userInitials = this.authService.getCurrentUserInitials() || '??';

    this.refresh();
    this.loadQuests();
    this.loadSideQuests();
    this.loadWorldState();
    this.loadTelemetryEvents();

    this.offlineStatus = this.offlineService.getStatus();
    this.offlineService.online$.subscribe(() => (this.offlineStatus = this.offlineService.getStatus()));
    this.offlineService.syncing$.subscribe(() => (this.offlineStatus = this.offlineService.getStatus()));

    const matchMedia = (typeof window !== 'undefined' ? (window as any).matchMedia : null);
    if (matchMedia) {
      this.reducedMotionMediaQuery = (window as any).matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = this.reducedMotionMediaQuery!.matches;
      this.reducedMotionMediaQuery!.addEventListener('change', this.handleReducedMotionChange);
    } else {
      this.isReducedMotion = false;
    }
  }

  private handleReducedMotionChange = (event: MediaQueryListEvent): void => {
    this.isReducedMotion = event.matches;
  };

  ngOnDestroy(): void {
    if (this.completionAnimationTimer) {
      clearTimeout(this.completionAnimationTimer);
      this.completionAnimationTimer = null;
    }
    if (this.reducedMotionMediaQuery) {
      this.reducedMotionMediaQuery.removeEventListener('change', this.handleReducedMotionChange);
    }
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('hero-hour-dark-mode', String(this.darkMode));
    this.applyDarkMode();
  }

  applyDarkMode(): void {
    const root = document.body;
    if (this.darkMode) {
      root.classList.add('hero-hour-dark-mode');
    } else {
      root.classList.remove('hero-hour-dark-mode');
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  navigateToLifeProfile(): void {
    void this.router.navigate(['/life-profile']);
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  refresh(): void {
    this.error = false;
    this.isLoadingHealth = true;

    this.healthService.getHealth().subscribe({
      next: (payload: HealthResponse) => {
        this.status = payload.status;
        this.isLoadingHealth = false;
      },
      error: () => {
        this.status = undefined;
        this.error = true;
        this.isLoadingHealth = false;
      },
      complete: () => {
        this.isLoadingHealth = false;
      },
    });
  }

  loadQuests(): void {
    this.isLoadingQuests = true;
    this.questService.getQuests(this.userId).subscribe({
      next: (quests) => {
        this.quests = quests;
        this.isLoadingQuests = false;
      },
      error: () => {
        this.quests = [];
        this.isLoadingQuests = false;
      },
      complete: () => {
        this.isLoadingQuests = false;
      },
    });
  }

  createQuest(): void {
    this.formError = '';

    if (!this.newQuestTitle.trim()) {
      this.formError = 'Please enter a quest title.';
      return;
    }

    if (!this.newQuestArea) {
      this.formError = 'Please select a life area.';
      return;
    }

    const payload: Omit<Quest, 'id' | 'userId'> = {
      title: this.newQuestTitle.trim(),
      lifeArea: this.newQuestArea,
      status: 'pending',
      progress: 0,
    };

    this.questService.createQuest(this.userId, payload).subscribe({
      next: () => {
        this.newQuestTitle = '';
        this.formError = '';
        this.loadQuests();
      },
    });
  }

  chooseSuggestedQuest(suggestion: { title: string; lifeArea: string }): void {
    this.newQuestTitle = suggestion.title;
    this.newQuestArea = suggestion.lifeArea as LifeArea;
  }

  loadSideQuests(): void {
    this.isLoadingSideQuests = true;
    this.questService.getSideQuests(this.userId).subscribe({
      next: (quests) => {
        this.sideQuests = quests;
        this.isLoadingSideQuests = false;
        this.refreshDailyGrid();
      },
      error: () => {
        this.sideQuests = [];
        this.isLoadingSideQuests = false;
        this.refreshDailyGrid();
      },
      complete: () => {
        this.isLoadingSideQuests = false;
      },
    });
  }

  refreshDailyGrid(): void {
    const defaultCells = Array.from({ length: 24 }).map((_, idx) => ({ index: idx, completed: false }));
    const activityMap: Record<number, 'work' | 'exercise' | 'social' | 'rest'> = {
      2: 'rest',
      5: 'work',
      8: 'exercise',
      11: 'social',
      15: 'work',
      18: 'rest',
      20: 'social',
    };

    const updated = defaultCells.map((cell) => {
      const activity = activityMap[cell.index];
      if (activity) {
        return { ...cell, activity, completed: cell.index % 3 !== 0 };
      }
      return cell;
    });

    this.dailyGridCells = updated;
  }

  loadWorldState(): void {
    this.isLoadingWorldState = true;
    this.questService.getWorldState(this.userId).subscribe({
      next: (state) => {
        this.worldState = state;
        this.isLoadingWorldState = false;
      },
      error: () => {
        this.isLoadingWorldState = false;
      },
      complete: () => {
        this.isLoadingWorldState = false;
      },
    });
  }
  loadTelemetryEvents(): void {
    this.isLoadingTelemetry = true;
    this.telemetryService.getTelemetryEvents().subscribe({
      next: (items) => {
        this.telemetryEvents = items;
        this.isLoadingTelemetry = false;
      },
      error: () => {
        this.telemetryEvents = [];
        this.isLoadingTelemetry = false;
      },
      complete: () => {
        this.isLoadingTelemetry = false;
      },
    });
  }

  claimSideQuest(sideQuestId: string): void {
    this.questService.claimSideQuest(this.userId, sideQuestId).subscribe({
      next: () => {
        this.activateCompletionAnimation(undefined, sideQuestId);
        this.loadSideQuests();
        this.loadWorldState();
      },
      error: () => console.warn('Failed to claim side quest'),
    });
  }

  claimQuest(quest: Quest): void {
    this.questService.updateQuest(this.userId, quest.id, { status: 'complete', progress: 100 }).subscribe({
      next: () => {
        this.activateCompletionAnimation(quest.id, undefined);
        this.loadQuests();
        this.loadWorldState();
      },
      error: () => console.warn('Failed to complete quest'),
    });
  }

  syncOffline(): void {
    this.offlineService.syncQueue().subscribe({
      next: () => this.loadWorldState(),
      error: () => console.warn('Failed to sync offline queue'),
    });
  }

  logActivity(type: string): void {
    this.selectedActivity = type;
    localStorage.setItem('hero-hour-selected-activity', type);

    this.questService.logActivity(this.userId, type, 5).subscribe({
      next: (state) => {
        this.worldState = state;
      },
    });
  }
}
