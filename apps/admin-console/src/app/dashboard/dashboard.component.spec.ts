import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { HealthService } from '../services/health.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let healthService: { getHealth: () => any };

  beforeEach(async () => {
    healthService = {
      getHealth: () => of({ status: 'ok', uptime: 100 }),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [{ provide: HealthService, useValue: healthService }],
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
