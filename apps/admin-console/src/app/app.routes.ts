import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LifeProfileComponent } from './life-profile/life-profile.component';
import { GrowthMapComponent } from './growth-map/growth-map.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login.component';
import { AppLoadingComponent } from './app-loading.component';

export const appRoutes: Route[] = [
  { path: '', component: AppLoadingComponent },
  { path: 'splash', component: AppLoadingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'life-profile', component: LifeProfileComponent, canActivate: [AuthGuard] },
  { path: 'growth-map', component: GrowthMapComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];
