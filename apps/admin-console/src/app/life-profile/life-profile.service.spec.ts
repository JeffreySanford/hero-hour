import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LifeProfileService } from './life-profile.service';
import type { LifeProfile } from '@org/api-interfaces';

describe('LifeProfileService', () => {
  let service: LifeProfileService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LifeProfileService],
    });

    service = TestBed.inject(LifeProfileService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should post profile and return value', () => {
    const profile: LifeProfile = {
      userId: 'demo-user',
      firstName: 'Sam',
      lastName: 'Go',
      age: 30,
      preferredRole: 'leader',
      roles: ['leader'],
      schedule: {},
      priorities: [],
      frictionPoints: [],
      habitAnchors: [],
      status: 'active',
      privacy: 'private',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    service.save(profile).subscribe((result) => {
      expect(result).toEqual(profile);
    });

    const req = http.expectOne('/api/life-profile');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(profile);
    req.flush(profile);
  });

  it('should fetch village state via API', () => {
    const userId = 'demo-user';
    const villageState = { structures: [{ id: 's1', name: 'Campfire', lifeArea: 'fun', level: 1, progress: 10, unlocked: true }], totalProgress: 10, updatedAt: new Date().toISOString() };
    service.getVillageState(userId).subscribe((result) => {
      expect(result).toEqual(villageState);
    });

    const req = http.expectOne(`/api/game-profile/${encodeURIComponent(userId)}/village`);
    expect(req.request.method).toBe('GET');
    req.flush(villageState);
  });
});
