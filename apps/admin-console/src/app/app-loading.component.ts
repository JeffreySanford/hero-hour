import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-loading',
  templateUrl: './app-loading.component.html',
  styleUrls: ['./app-loading.component.scss'],
})
export class AppLoadingComponent implements OnInit, OnDestroy {
  stages = ['Time begins', 'Grid activates', 'Tasks check', 'World ignites', 'Ready'];
  activeStage = 0;
  progress = 0;
  timeoutId: any;
  stageIntervalId: any;
  isReducedMotion = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseMs = this.isReducedMotion ? 350 : this.authService.isAuthenticated() ? 600 : 1800;
    const stageMs = Math.max(120, Math.ceil(baseMs / (this.stages.length - 1)));

    this.stageIntervalId = window.setInterval(() => {
      if (this.activeStage < this.stages.length - 1) {
        this.activeStage++;
        this.progress = (this.activeStage / (this.stages.length - 1)) * 100;
      }
    }, stageMs);

    this.timeoutId = window.setTimeout(() => this.complete(), Math.min(8000, baseMs * 3));
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.timeoutId);
    window.clearInterval(this.stageIntervalId);
  }

  complete(): void {
    window.clearTimeout(this.timeoutId);
    window.clearInterval(this.stageIntervalId);
    const target = this.authService.isAuthenticated() ? '/dashboard' : '/login';
    this.router.navigateByUrl(target);
  }

  skip(): void {
    this.complete();
  }
}
