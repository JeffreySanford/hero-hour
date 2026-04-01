import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import * as AuthActions from './auth.actions';
import { AuthUser } from './auth.models';

export interface State extends EntityState<AuthUser> {
  currentUserId: string | null;
  error: string | null;
  loaded: boolean;
}

export const adapter: EntityAdapter<AuthUser> = createEntityAdapter<AuthUser>({ selectId: (user) => user.id });

export const initialState: State = adapter.getInitialState({ currentUserId: null, error: null, loaded: false });

export const reducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state: State, { user }) =>
    adapter.setOne(user, {
      ...state,
      currentUserId: user.id,
      error: null,
      loaded: true,
    }),
  ),
  on(AuthActions.logoutSuccess, (state: State) => adapter.removeAll({ ...state, currentUserId: null, loaded: false })),
  on(AuthActions.loginFailure, (state: State, { error }: { error: string }) => ({ ...state, error })),
  on(AuthActions.loadCurrentUserSuccess, (state: State, { user }) =>
    adapter.upsertOne(user, {
      ...state,
      currentUserId: user.id,
      loaded: true,
      error: null,
    }),
  ),
  on(AuthActions.loadCurrentUserFailure, (state: State, { error }: { error: string }) => ({ ...state, error })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
