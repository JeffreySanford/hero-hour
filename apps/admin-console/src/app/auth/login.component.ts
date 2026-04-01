import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const name = this.email.split('@')[0].replace('.', ' ');
        this.authService.setCurrentUser({ fullName: name, email: this.email });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => (this.error = err?.error?.message || 'Login failed'),
    });
  }
}