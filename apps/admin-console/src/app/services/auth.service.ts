import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'hero-hour-authenticated';
  private authenticated = false;

  constructor() {
    this.authenticated = localStorage.getItem(this.storageKey) === 'true';
  }

  login(): void {
    this.authenticated = true;
    localStorage.setItem(this.storageKey, 'true');
  }

  logout(): void {
    this.authenticated = false;
    localStorage.removeItem(this.storageKey);
  }

  isAuthenticated(): boolean {
    this.authenticated = localStorage.getItem(this.storageKey) === 'true';
    return this.authenticated;
  }
}
