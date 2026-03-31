import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AuthService] });
    service = TestBed.inject(AuthService);
  });

  it('should be unauthenticated by default', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should become authenticated after login and unauthenticated after logout', () => {
    service.login();
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });
});
