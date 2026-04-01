import { Component, OnInit } from '@angular/core';
import { HealthService, HealthStatus } from '../services/health.service';
import { QuestService, Quest, LifeArea, WorldState, SideQuest } from '../services/quest.service';

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

  quests: Quest[] = [];
  sideQuests: SideQuest[] = [];
  newQuestTitle = '';
  newQuestArea: LifeArea = 'health';
  worldState: WorldState = { seed: 0, color: 'gray', icon: '⏳', progress: 0 };

  constructor(private readonly healthService: HealthService, private readonly questService: QuestService) {}

  ngOnInit(): void {
    this.refresh();
    this.loadQuests();
    this.loadSideQuests();
    this.loadWorldState();
  }

  refresh(): void {
    this.error = false;

    this.healthService.getHealth().subscribe({
      next: (payload: HealthStatus) => {
        this.status = payload.status;
      },
      error: () => {
        this.status = undefined;
        this.error = true;
      },
    });
  }

  loadQuests(): void {
    this.questService.getQuests(this.userId).subscribe({
      next: (quests) => (this.quests = quests),
      error: () => {
        this.quests = [];
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
    this.questService.getSideQuests(this.userId).subscribe({
      next: (quests) => (this.sideQuests = quests),
    });
  }

  loadWorldState(): void {
    this.questService.getWorldState(this.userId).subscribe({
      next: (state) => (this.worldState = state),
    });
  }

  claimSideQuest(sideQuestId: string): void {
    this.questService.claimSideQuest(this.userId, sideQuestId).subscribe({
      next: () => this.loadSideQuests(),
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
