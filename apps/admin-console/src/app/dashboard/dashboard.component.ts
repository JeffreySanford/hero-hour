import { Component, OnInit } from '@angular/core';
import { HealthService } from '../services/health.service';
import type { HealthResponse } from '@org/api-interfaces';
import { QuestService, Quest, LifeArea, WorldState, SideQuest } from '../services/quest.service';
import { OfflineService } from '../services/offline.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  status?: string;
  error = false;
  readonly userId = 'demo-user';

  offlineStatus: 'online' | 'offline' | 'syncing' = 'online';

  quests: Quest[] = [];
  sideQuests: SideQuest[] = [];
  newQuestTitle = '';
  newQuestArea: LifeArea = 'health';
  worldState: WorldState = { seed: 0, color: 'gray', icon: '⏳', progress: 0 };
  darkMode = false;
  profileMenuOpen = false;
  userInitials = '??';

  isLoadingHealth = true;
  isLoadingQuests = true;
  isLoadingSideQuests = true;
  isLoadingWorldState = true;

  constructor(
    private readonly healthService: HealthService,
    private readonly questService: QuestService,
    private readonly offlineService: OfflineService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.darkMode = localStorage.getItem('hero-hour-dark-mode') === 'true';
    this.applyDarkMode();

    this.userInitials = this.authService.getCurrentUserInitials() || '??';

    this.refresh();
    this.loadQuests();
    this.loadSideQuests();
    this.loadWorldState();

    this.offlineStatus = this.offlineService.getStatus();
    this.offlineService.online$.subscribe(() => (this.offlineStatus = this.offlineService.getStatus()));
    this.offlineService.syncing$.subscribe(() => (this.offlineStatus = this.offlineService.getStatus()));
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
      },
      error: () => {
        this.status = undefined;
        this.error = true;
      },
      complete: () => {
        this.isLoadingHealth = false;
      },
    });
  }

  loadQuests(): void {
    this.isLoadingQuests = true;
    this.questService.getQuests(this.userId).subscribe({
      next: (quests) => (this.quests = quests),
      error: () => {
        this.quests = [];
      },
      complete: () => {
        this.isLoadingQuests = false;
      },
    });
  }

  createQuest(): void {
    if (!this.newQuestTitle.trim()) return;

    const payload: Omit<Quest, 'id' | 'userId'> = {
      title: this.newQuestTitle.trim(),
      lifeArea: this.newQuestArea,
      status: 'pending',
      progress: 0,
    };

    this.questService.createQuest(this.userId, payload).subscribe({
      next: () => {
        this.newQuestTitle = '';
        this.loadQuests();
      },
    });
  }

  claimQuest(quest: Quest): void {
    this.questService.updateQuest(this.userId, quest.id, { status: 'complete', progress: 100 }).subscribe({
      next: () => this.loadQuests(),
    });
  }

  loadSideQuests(): void {
    this.isLoadingSideQuests = true;
    this.questService.getSideQuests(this.userId).subscribe({
      next: (quests) => (this.sideQuests = quests),
      complete: () => {
        this.isLoadingSideQuests = false;
      },
    });
  }

  loadWorldState(): void {
    this.isLoadingWorldState = true;
    this.questService.getWorldState(this.userId).subscribe({
      next: (state) => (this.worldState = state),
      complete: () => {
        this.isLoadingWorldState = false;
      },
    });
  }

  claimSideQuest(sideQuestId: string): void {
    this.questService.claimSideQuest(this.userId, sideQuestId).subscribe({
      next: () => this.loadSideQuests(),
    });
  }

  syncOffline(): void {
    this.offlineService.syncQueue().subscribe({
      next: () => this.loadWorldState(),
      error: () => console.warn('Failed to sync offline queue'),
    });
  }

  logActivity(type: string): void {
    this.questService.logActivity(this.userId, type, 5).subscribe({
      next: (state) => {
        this.worldState = state;
      },
    });
  }
}
