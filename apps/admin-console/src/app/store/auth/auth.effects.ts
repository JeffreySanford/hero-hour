import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$: any;
  logout$: any;

  constructor(@Inject(Actions) private actions$: Actions, private authService: AuthService) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ email, password }) =>
          this.authService.login(email, password).pipe(
            map((result) =>
              AuthActions.loginSuccess({
                user: {
                  id: email,
                  email,
                  verified: true,
                  roles: ['user'],
                  accessToken: result.accessToken,
                  refreshToken: result.refreshToken,
                },
              }),
            ),
            catchError((error) => of(AuthActions.loginFailure({ error: error.message || 'Login failure' }))),
          ),
        ),
      ),
    );

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(async () => {
            await this.authService.logout();
          }),
        ),
      { dispatch: false },
    );
  }
}
