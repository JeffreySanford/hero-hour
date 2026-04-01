import * as AuthActions from './auth.actions';
import { reducer as authReducer, initialState } from './auth.reducer';

describe('Auth Reducer', () => {
  it('should set current user after loginSuccess', () => {
    const user = {
      id: 'user1',
      email: 'test@example.com',
      verified: true,
      roles: ['user'],
      accessToken: 'tok',
      refreshToken: 'ref',
    };

    const action = AuthActions.loginSuccess({ user });
    const result = authReducer(initialState, action);

    expect(result.currentUserId).toBe('user1');
    expect(result.entities['user1']).toEqual(user);
  });

  it('should clear state on logoutSuccess', () => {
    const user = {
      id: 'user1',
      email: 'test@example.com',
      verified: true,
      roles: ['user'],
      accessToken: 'tok',
      refreshToken: 'ref',
    };

    const loggedInState = authReducer(initialState, AuthActions.loginSuccess({ user }));
    const loggedOutState = authReducer(loggedInState, AuthActions.logoutSuccess());

    expect(loggedOutState.currentUserId).toBeNull();
    expect(loggedOutState.ids.length).toBe(0);
  });
});