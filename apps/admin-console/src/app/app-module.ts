import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app';
import { appRoutes } from './app.routes';
import { NxWelcome } from './nx-welcome';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LifeProfileComponent } from './life-profile/life-profile.component';
import { LoginComponent } from './auth/login.component';

@NgModule({
  declarations: [App, NxWelcome, DashboardComponent, LifeProfileComponent, LoginComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), HttpClientModule, ReactiveFormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
