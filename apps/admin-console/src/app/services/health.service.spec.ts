import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HealthService, HealthStatus } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HealthService],
    });

    service = TestBed.inject(HealthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should request /api/health and return payload', () => {
    const mock: HealthStatus = { status: 'ok', uptime: 1234 };

    service.getHealth().subscribe((result) => {
      expect(result).toEqual(mock);
    });

    const req = http.expectOne('/api/health');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should propagate error to subscriber', () => {
    service.getHealth().subscribe({
      next: () => expect(true).toBe(false),
      error: (err) => expect(err.status).toBe(500),
    });

    const req = http.expectOne('/api/health');
    req.flush({ message: 'failed' }, { status: 500, statusText: 'Server Error' });
  });
});
