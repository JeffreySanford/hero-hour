import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

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
        next: () => {},
        error: () => {},
      });
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('hero-hour-authenticated');
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
