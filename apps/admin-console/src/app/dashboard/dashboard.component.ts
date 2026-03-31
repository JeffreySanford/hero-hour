import { Component, OnInit } from '@angular/core';
import { HealthService, HealthStatus } from '../services/health.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
