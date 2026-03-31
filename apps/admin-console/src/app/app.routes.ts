import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LifeProfileComponent } from './life-profile/life-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'life-profile', component: LifeProfileComponent, canActivate: [AuthGuard] },
];
