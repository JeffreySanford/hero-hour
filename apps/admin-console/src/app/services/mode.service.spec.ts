import { TestBed } from '@angular/core/testing';
import { ModeService } from './mode.service';

describe('ModeService', () => {
  let service: ModeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeService);
  });

  it('should default to casual mode', () => {
    expect(service.getMode()).toBe('casual');
  });

  it('should persist mode in localStorage', () => {
    service.setMode('pro');
    expect(service.getMode()).toBe('pro');
    const value = localStorage.getItem('hero-hour-mode');
    expect(value).toBe('pro');
  });

  it('should toggle mode', () => {
    service.setMode('casual');
    service.toggleMode();
    expect(service.getMode()).toBe('pro');
    service.toggleMode();
    expect(service.getMode()).toBe('casual');
  });

  it('should rehydrate mode from localStorage', () => {
    localStorage.setItem('hero-hour-mode', 'pro');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeService);
    expect(service.getMode()).toBe('pro');
  });
});