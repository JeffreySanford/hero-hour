import { createAction, props } from '@ngrx/store';
import { AuthUser } from './auth.models';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: AuthUser }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

export const loadCurrentUser = createAction('[Auth] Load Current User');
export const loadCurrentUserSuccess = createAction('[Auth] Load Current User Success', props<{ user: AuthUser }>());
export const loadCurrentUserFailure = createAction('[Auth] Load Current User Failure', props<{ error: string }>());
