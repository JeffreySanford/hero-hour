import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService, LoginResponse } from '../services/auth.service';

class MockRouter {
  public navigations: any[] = [];
  navigate(commands: any[]) {
    this.navigations.push(commands);
    return Promise.resolve(true);
  }
}

class MockAuthService {
  login = (_email: string, _password: string) => {
    localStorage.setItem('hero-hour-token', 'fake-token');
    localStorage.setItem('hero-hour-refresh-token', 'fake-refresh');
    return of<LoginResponse>({ accessToken: 'fake-token', refreshToken: 'fake-refresh' });
  };
  logout = () => undefined;
  isAuthenticated = () => !!localStorage.getItem('hero-hour-token');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: MockRouter;

  beforeEach(async () => {
    localStorage.clear();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('logs in and navigates to dashboard', async () => {
    component.email = 'test@example.com';
    component.password = 'secret';

    component.login();
    await fixture.whenStable();

    expect(router.navigations[0]).toEqual(['/dashboard']);
    expect(authService.isAuthenticated()).toBe(true);
  });
});
