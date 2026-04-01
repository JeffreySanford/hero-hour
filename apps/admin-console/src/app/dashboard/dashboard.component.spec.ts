import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { HealthService } from '../services/health.service';
import { QuestService } from '../services/quest.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let healthService: { getHealth: () => any };

  beforeEach(async () => {
    healthService = {
      getHealth: () => of({ status: 'ok', uptime: 100 }),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DashboardComponent],
      providers: [
        { provide: HealthService, useValue: healthService },
        {
          provide: QuestService,
          useValue: {
            getQuests: () => of([]),
            getSideQuests: () => of([]),
            createQuest: () => of(null),
            updateQuest: () => of(null),
            claimSideQuest: () => of(null),
            logActivity: () => of({ seed: 1, color: 'blue', icon: '🌱', progress: 0 }),
            getWorldState: () => of({ seed: 1, color: 'blue', icon: '🌱', progress: 0 }),
          },
        },
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
    expect(fixture.nativeElement.textContent).toContain('Failed to load health');
  });
});
