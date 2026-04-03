import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppLoadingComponent } from './app-loading.component';
import { AuthService } from './services/auth.service';

describe('AppLoadingComponent', () => {
  let component: AppLoadingComponent;
  let fixture: ComponentFixture<AppLoadingComponent>;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let authService: { isAuthenticated: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    router = { navigateByUrl: vi.fn() };
    authService = { isAuthenticated: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AppLoadingComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLoadingComponent);
    component = fixture.componentInstance;

    if (typeof window !== 'undefined' && !window.matchMedia) {
      (window as any).matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      });
    }
  });

  afterEach(() => {
    component.ngOnDestroy();
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard if authenticated on complete', () => {
    authService.isAuthenticated.mockReturnValue(true);
    component.complete();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate to login if not authenticated on complete', () => {
    authService.isAuthenticated.mockReturnValue(false);
    component.complete();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should call complete when skip is used', () => {
    const completeSpy = vi.spyOn(component, 'complete');
    authService.isAuthenticated.mockReturnValue(false);

    component.skip();
    expect(completeSpy).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should progress stages and complete after timeout', () => {
    authService.isAuthenticated.mockReturnValue(false);

    component.stages = ['A', 'B', 'C'];
    vi.useFakeTimers();
    component.ngOnInit();

    expect(component.activeStage).toBeGreaterThanOrEqual(0);

    vi.advanceTimersByTime(6000);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    vi.useRealTimers();
  });

  it('should cancel timer and interval on destroy', () => {
    vi.useFakeTimers();
    authService.isAuthenticated.mockReturnValue(false);
    component.ngOnInit();

    component.ngOnDestroy();
    vi.advanceTimersByTime(1000);

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});