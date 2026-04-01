import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { LoginResponse } from '@org/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'hero-hour-token';
  private readonly refreshTokenKey = 'hero-hour-refresh-token';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((resp) => {
        this.setToken(resp.accessToken);
        this.setRefreshToken(resp.refreshToken);
      })
    );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post('/api/auth/logout', {}).subscribe({
        next: () => {
          // no-op: logout request acknowledgements are not needed in client-side flow
        },
        error: () => {
          // no-op: ignore logout errors (best effort cleanup)
        },
      });
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('hero-hour-authenticated');
    localStorage.removeItem('hero-hour-user');
  }

  setCurrentUser(user: { fullName: string; email?: string }): void {
    localStorage.setItem('hero-hour-user', JSON.stringify(user));
  }

  getCurrentUser(): { fullName: string; email?: string } | null {
    const userJson = localStorage.getItem('hero-hour-user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  getCurrentUserInitials(): string {
    const user = this.getCurrentUser();
    if (!user?.fullName) return '';
    const parts = user.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase());
    return parts.join('').slice(0, 2);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('hero-hour-authenticated', 'true');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }
}
