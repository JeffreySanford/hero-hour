import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DailyGridComponent } from './daily-grid.component';
import { HealthService } from '../services/health.service';
import { QuestService } from '../services/quest.service';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let healthService: { getHealth: () => any };
  let questService: any;
  let router: { navigate: (commands: string[]) => Promise<boolean> };
  let claimSideQuestCalled = false;
  let sideQuestsState: Array<{ id: string; userId: string; title: string; type: string; completed: boolean; rewardXp: number }>;

  beforeEach(async () => {
    healthService = {
      getHealth: () => of({ status: 'ok', uptime: 100 }),
    };

    claimSideQuestCalled = false;
    sideQuestsState = [
      { id: 'sq-1', userId: 'demo-user', title: 'Quick setup', type: 'quick-win', completed: false, rewardXp: 10 },
      { id: 'sq-2', userId: 'demo-user', title: 'Daily streak', type: 'daily', completed: false, rewardXp: 20 },
    ];

    questService = {
      getQuests: () => of([]),
      getSideQuests: () => of(sideQuestsState),
      createQuest: () => of(null),
      updateQuest: () => of(null),
      claimSideQuest: () => {
        claimSideQuestCalled = true;
        sideQuestsState = sideQuestsState.map((quest) =>
          quest.id === 'sq-1' ? { ...quest, completed: true } : quest
        );
        return of({ id: 'sq-1', userId: 'demo-user', title: 'Quick setup', type: 'quick-win', completed: true, rewardXp: 10 });
      },
      logActivity: () => of({ seed: 1, color: 'blue', icon: '🌱', progress: 0 }),
      getWorldState: () => of({ seed: 1, color: 'blue', icon: '🌱', progress: 0 }),
    };

    router = {
      navigate: () => Promise.resolve(true),
    };


    await TestBed.configureTestingModule({
      imports: [FormsModule, DailyGridComponent],
      declarations: [DashboardComponent],
      providers: [
        { provide: HealthService, useValue: healthService },
        { provide: QuestService, useValue: questService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should display status from health service on refresh', () => {
    healthService.getHealth = () => of({ status: 'ok', uptime: 100 });

    component.refresh();
    fixture.detectChanges();

    expect(component.status).toBe('ok');
    expect(fixture.nativeElement.textContent).toContain('API status: ok');
    expect(component.error).toBe(false);
  });

  it('should show error when health service fails', () => {
    healthService.getHealth = () => throwError(() => new Error('Failed'));

    component.refresh();
    fixture.detectChanges();

    expect(component.status).toBeUndefined();
    expect(component.error).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Offline');
  });

  it('should toggle dark mode and persist preference', () => {
    document.body.classList.remove('hero-hour-dark-mode');
    localStorage.removeItem('hero-hour-dark-mode');

    component.darkMode = false;
    component.toggleDarkMode();

    expect(component.darkMode).toBe(true);
    expect(localStorage.getItem('hero-hour-dark-mode')).toBe('true');
    expect(document.body.classList.contains('hero-hour-dark-mode')).toBe(true);
  });

  it('should set selected activity and persist it', () => {
    localStorage.removeItem('hero-hour-selected-activity');

    component.logActivity('work');

    expect(component.selectedActivity).toBe('work');
    expect(localStorage.getItem('hero-hour-selected-activity')).toBe('work');
  });

  it('should update world state when logActivity is called', () => {
    questService.logActivity = () => of({ seed: 21, color: 'gold', icon: '🌟', progress: 35 });

    component.logActivity('exercise');

    expect(component.worldState.seed).toBe(21);
    expect(component.worldState.progress).toBe(35);
  });

  it('should load side quests and claim one', () => {
    component.loadSideQuests();
    fixture.detectChanges();

    expect(component.sideQuests.length).toBe(2);
    expect(component.sideQuests[0].title).toBe('Quick setup');

    component.claimSideQuest('sq-1');
    expect(claimSideQuestCalled).toBe(true);
  });

  it('should animate quest and side quest completion states', () => {
    questService.getQuests = () => of([{ id: 'q1', userId: 'demo-user', title: 'Test', lifeArea: 'health', status: 'pending', progress: 0 }]);
    questService.getSideQuests = () => of([{ id: 'sq1', userId: 'demo-user', title: 'Test side', type: 'quick-win' as any, completed: false, rewardXp: 10 }]);

    // Intent: use the shared animation trigger helper so behavior is easier to test and maintain.
    component.activateCompletionAnimation('q1', 'sq1', 1000);

    fixture.detectChanges();

    const questItemDebug = fixture.debugElement.query(By.css('.quest-item'));
    const sideQuestItemDebug = fixture.debugElement.query(By.css('.side-quest-card'));

    expect(questItemDebug).toBeTruthy();
    expect(sideQuestItemDebug).toBeTruthy();
    expect(questItemDebug.nativeElement.classList.contains('animate-complete')).toBe(true);
    expect(sideQuestItemDebug.nativeElement.classList.contains('animate-claimed')).toBe(true);
  });

  it('should activate and clear animation state using activateCompletionAnimation()', () => {
    vi.useFakeTimers();

    component.activateCompletionAnimation('q1', 'sq1', 1000);

    expect(component.recentlyCompletedQuestId).toBe('q1');
    expect(component.recentlyClaimedSideQuestId).toBe('sq1');

    vi.advanceTimersByTime(1000);

    expect(component.recentlyCompletedQuestId).toBeNull();
    expect(component.recentlyClaimedSideQuestId).toBeNull();

    vi.useRealTimers();
  });

  it('should cancel prior animation timer when called repeatedly', () => {
    vi.useFakeTimers();

    component.activateCompletionAnimation('q1', undefined, 1500);
    expect(component.recentlyCompletedQuestId).toBe('q1');

    component.activateCompletionAnimation('q2', undefined, 1500);
    expect(component.recentlyCompletedQuestId).toBe('q2');

    vi.advanceTimersByTime(1500);
    expect(component.recentlyCompletedQuestId).toBeNull();

    vi.useRealTimers();
  });
  it('should keep only the last of triple activated animations and clear old ids', () => {
    vi.useFakeTimers();

    component.activateCompletionAnimation('q1', undefined, 1000);
    component.activateCompletionAnimation('q2', undefined, 1000);
    component.activateCompletionAnimation('q3', undefined, 1000);

    expect(component.recentlyCompletedQuestId).toBe('q3');

    // after 999ms, still active
    vi.advanceTimersByTime(999);
    expect(component.recentlyCompletedQuestId).toBe('q3');

    // after 1 more ms (1000ms total), animation should finish once
    vi.advanceTimersByTime(1);
    expect(component.recentlyCompletedQuestId).toBeNull();

    vi.useRealTimers();
  });
  it('should use reduced duration when reduced motion is enabled', () => {
    vi.useFakeTimers();

    component.isReducedMotion = true;
    component.activateCompletionAnimation('q1', undefined, 1000);

    vi.advanceTimersByTime(300);
    expect(component.recentlyCompletedQuestId).toBeNull();

    vi.useRealTimers();
  });

  it('should render side quest cards in the UI', () => {
    fixture.detectChanges();

    const sideQuestCards = fixture.nativeElement.querySelectorAll('.side-quest-card');
    expect(sideQuestCards.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Quick setup');
    expect(fixture.nativeElement.textContent).toContain('Available');
  });

  it('should show validation and helper text for quest quick-add', () => {
    component.newQuestTitle = '';
    component.newQuestArea = 'health';
    component.createQuest();

    expect(component.formError).toBe('Please enter a quest title.');

    component.newQuestTitle = 'Test quest';
    component.createQuest();

    expect(component.formError).toBe('');
    expect(component.newQuestTitle).toBe('');
  });

  it('should render prioritized dashboard cards in the expected order', () => {
    fixture.detectChanges();
    const titles = Array.from(fixture.nativeElement.querySelectorAll('article.hero-card .hero-card__title')).map((el: any) => el.textContent.trim());
    expect(titles[0]).toBe('API Status');
    expect(titles[1]).toBe('World Seed State');
    expect(titles[2]).toBe('Telemetry Events');
    expect(titles[3]).toBe('Sync Status');
  });

  it('should navigate to life profile from the dashboard action', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.navigateToLifeProfile();

    expect(navigateSpy).toHaveBeenCalledWith(['/life-profile']);
  });
});
