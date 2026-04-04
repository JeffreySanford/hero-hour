import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { QuestService } from './quest.service';
import { OfflineService } from './offline.service';
import { Quest, LifeArea, QuestStatus } from '@org/api-interfaces';

describe('QuestService', () => {
  let service: QuestService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestService, OfflineService],
    });
    service = TestBed.inject(QuestService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should create quest through API', () => {
    const questData: Omit<Quest, 'id' | 'userId'> = {
      title: 'Test',
      lifeArea: 'career' as LifeArea,
      status: 'pending' as QuestStatus,
      progress: 0,
    };
    service.createQuest('demo-user', questData).subscribe((res) => {
      expect(res.id).toBe('q1');
    });

    const req = http.expectOne('/api/game-profile/demo-user/quests');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'q1', userId: 'demo-user', ...questData });
  });

  it('should complete quest through completeQuest', () => {
    service.completeQuest('demo-user', 'q1').subscribe((res) => {
      expect(res.id).toBe('q1');
      expect(res.status).toBe('complete');
      expect(res.progress).toBe(100);
    });

    const req = http.expectOne('/api/game-profile/demo-user/quests/q1/complete');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ quest: { id: 'q1', userId: 'demo-user', title: 'Test', lifeArea: 'career', status: 'complete', progress: 100 }, worldState: { seed: 110, color: 'blue', icon: '🌱', progress: 50 }, profile: { userId: 'demo-user', avatar: 'default', theme: 'default', displayName: '', xp: 0, level: 1, streak: 0 } });
  });

  it('should request world state', () => {
    service.getWorldState('demo-user').subscribe((ws) => {
      expect(ws.progress).toBe(42);
    });

    const req = http.expectOne('/api/game-profile/demo-user/world-state');
    expect(req.request.method).toBe('GET');
    req.flush({ seed: 123, color: 'blue', icon: '🌱', progress: 42 });
  });

  it('should request the game profile', () => {
    service.getProfile('demo-user').subscribe((profile) => {
      expect(profile.avatarStage).toBe('pathfinder');
      expect(profile.identityTitle).toBe('Quest Pathfinder');
    });

    const req = http.expectOne('/api/game-profile/demo-user');
    expect(req.request.method).toBe('GET');
    req.flush({
      userId: 'demo-user',
      avatar: 'pathfinder',
      theme: 'ember',
      displayName: 'Anne Lee',
      xp: 45,
      level: 1,
      streak: 2,
      avatarStage: 'pathfinder',
      identityTitle: 'Quest Pathfinder',
      unlockedAvatars: ['default', 'pathfinder'],
      unlockedThemes: ['default', 'ember'],
      nextMilestoneXp: 120,
      nextMilestoneLabel: 'Tempo Captain',
      progressToNextMilestone: 6,
    });
  });
});
