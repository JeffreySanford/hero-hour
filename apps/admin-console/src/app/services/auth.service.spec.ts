import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthService] });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be unauthenticated by default', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should become authenticated after login and unauthenticated after logout', async () => {
    const httpClientSpy: any = {
      post: () => of({ accessToken: 'abc', refreshToken: 'def' }),
    };

    const authService = new AuthService(httpClientSpy);
    await firstValueFrom(authService.login('test@example.com', 'test'));

    expect(authService.isAuthenticated()).toBe(true);

    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
  });
});
