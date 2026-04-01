import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LifeProfileService } from './life-profile.service';

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
    const profile = { userId: 'demo-user', firstName: 'Sam', lastName: 'Go', age: 30, preferredRole: 'leader' as const };

    service.save(profile).subscribe((result) => {
      expect(result).toEqual(profile);
    });

    const req = http.expectOne('/api/life-profile');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(profile);
    req.flush(profile);
  });
});
