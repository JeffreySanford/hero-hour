import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { App } from './app';
import { appRoutes } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LifeProfileComponent } from './life-profile/life-profile.component';
import { LoginComponent } from './auth/login.component';
import { HeaderModule } from './layout/header/header.module';
import { FooterModule } from './layout/footer/footer.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { reducer as authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';

@NgModule({
  declarations: [App, DashboardComponent, LifeProfileComponent, LoginComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderModule,
    FooterModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
