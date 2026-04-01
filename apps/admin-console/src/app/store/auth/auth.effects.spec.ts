import { Subject, of, firstValueFrom } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';

describe('AuthEffects', () => {
  let actions$: Subject<any>;
  let effects: AuthEffects;
  const authServiceStub = {
    login: vi.fn((email: string, password: string) => of({ accessToken: 'tok', refreshToken: 'ref' })),
    logout: vi.fn(() => Promise.resolve()),
  };

  beforeEach(() => {
    actions$ = new Subject<any>();
    effects = new AuthEffects(actions$, authServiceStub as any);
  });

  it('should dispatch loginSuccess on login', async () => {
    const loginAction = AuthActions.login({ email: 'a@b.com', password: 'pass' });
    const resultPromise = firstValueFrom(effects.login$);

    actions$.next(loginAction);

    const action = await resultPromise;
    expect((action as any).type).toBe(AuthActions.loginSuccess.type);
  });
});