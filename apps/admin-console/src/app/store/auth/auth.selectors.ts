import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>('auth');

export const selectCurrentUserId = createSelector(selectAuthState, (state) => state.currentUserId);
export const selectAllUsers = createSelector(selectAuthState, fromAuth.selectAll);
export const selectCurrentUser = createSelector(selectAuthState, selectCurrentUserId, (state, id) => (id ? state.entities[id] : null));
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectIsAuthenticated = createSelector(selectCurrentUser, (user) => !!user);
