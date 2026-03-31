import { Component, OnInit } from '@angular/core';
import { HealthService, HealthStatus } from '../services/health.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  template: `
    <h2>Dashboard</h2>
    <button (click)="refresh()">Refresh status</button>
    <p *ngIf="status">API status: {{ status }}</p>
    <p *ngIf="error" class="error">Failed to load health</p>
  `,
})
export class DashboardComponent implements OnInit {
  status?: string;
  error = false;

  constructor(private readonly healthService: HealthService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.error = false;

    this.healthService.getHealth().subscribe({
      next: (payload: HealthStatus) => {
        this.status = payload.status;
      },
      error: () => {
        this.status = undefined;
        this.error = true;
      },
    });
  }
}
