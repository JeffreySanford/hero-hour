import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <button (click)="login()">Login</button>
  `,
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login();
    void this.router.navigate(['/dashboard']);
  }
}
