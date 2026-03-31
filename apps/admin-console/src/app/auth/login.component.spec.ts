import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';

class MockRouter {
  navigate = (commands: any[]) => Promise.resolve(true);
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: MockRouter;

  beforeEach(async () => {
    router = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [AuthService, { provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('logs in and navigates to dashboard', () => {
    expect(authService.isAuthenticated()).toBe(false);
    let navigated = false;
    const routeCommands: any[] = [];
    (router as any).navigate = (commands: any[]) => {
      navigated = true;
      routeCommands.push(commands);
      return Promise.resolve(true);
    };

    component.login();

    expect(authService.isAuthenticated()).toBe(true);
    expect(navigated).toBe(true);
    expect(routeCommands[0]).toEqual(['/dashboard']);
  });
});
