import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

class MockRouter {
  parseUrl(url: string) {
    return url as any;
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, AuthService, { provide: Router, useClass: MockRouter }],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should allow activate when authenticated', () => {
    authService.login();
    expect(guard.canActivate()).toBe(true);
  });

  it('should deny activate and redirect to login when unauthenticated', () => {
    authService.logout();
    expect(guard.canActivate()).toBe('/login');
  });
});
