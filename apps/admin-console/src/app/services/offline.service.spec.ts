import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OfflineService, OfflineAction } from './offline.service';

describe('OfflineService', () => {
  let service: OfflineService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfflineService],
    });

    service = TestBed.inject(OfflineService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should enqueue and return queued actions', () => {
    const action: OfflineAction = { type: 'create-quest', payload: { userId: 'demo-user', quest: { title: 'Test', lifeArea: 'career', status: 'pending', progress: 0 } } };
    service.enqueue(action);

    expect(service.getPendingCount()).toBe(1);
    expect(service.getQueue()).toEqual([action]);
  });

  it('should sync queue to API and clear queue', () => {
    const action1: OfflineAction = { type: 'create-quest', payload: { userId: 'demo-user', quest: { title: 'Test', lifeArea: 'career', status: 'pending', progress: 0 } } };
    const action2: OfflineAction = { type: 'log-activity', payload: { userId: 'demo-user', activity: { userId: 'demo-user', activityType: 'exercise', intensity: 5 } } };
    service.enqueue(action1);
    service.enqueue(action2);

    service.syncQueue().subscribe({
      error: () => {
        expect(true).toBe(false);
      },
    });

    const req1 = http.expectOne('/api/game-profile/demo-user/quests');
    expect(req1.request.method).toBe('POST');
    req1.flush({});

    const req2 = http.expectOne('/api/game-profile/demo-user/activity');
    expect(req2.request.method).toBe('POST');
    req2.flush({});

    expect(service.getPendingCount()).toBe(0);
  });
});