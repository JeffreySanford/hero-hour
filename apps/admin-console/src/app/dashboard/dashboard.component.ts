import { Component, OnInit } from '@angular/core';
import { HealthService } from '../services/health.service';
import type { HealthResponse } from '@org/api-interfaces';
import { QuestService, Quest, LifeArea, WorldState, SideQuest } from '../services/quest.service';
import { OfflineService } from '../services/offline.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
  selectedActivity = localStorage.getItem('hero-hour-selected-activity') || '';
  darkMode = false;
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

  constructor(
    private readonly healthService: HealthService,
    private readonly questService: QuestService,
    private readonly offlineService: OfflineService,
    private readonly authService: AuthService,
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

  claimQuest(quest: Quest): void {
    this.questService.updateQuest(this.userId, quest.id, { status: 'complete', progress: 100 }).subscribe({
      next: () => this.loadQuests(),
    });
  }

  loadSideQuests(): void {
    this.isLoadingSideQuests = true;
    this.questService.getSideQuests(this.userId).subscribe({
      next: (quests) => {
        this.sideQuests = quests;
        this.isLoadingSideQuests = false;
      },
      error: () => {
        this.sideQuests = [];
        this.isLoadingSideQuests = false;
      },
      complete: () => {
        this.isLoadingSideQuests = false;
      },
    });
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

  claimSideQuest(sideQuestId: string): void {
    this.questService.claimSideQuest(this.userId, sideQuestId).subscribe({
      next: () => {
        this.loadSideQuests();
        this.loadWorldState();
      },
      error: () => console.warn('Failed to claim side quest'),
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
