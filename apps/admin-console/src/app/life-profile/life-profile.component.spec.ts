import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LifeProfileComponent } from './life-profile.component';
import { LifeProfileService } from './life-profile.service';
import { GrowthMapComponent } from '../growth-map/growth-map.component';

describe('LifeProfileComponent', () => {
  let component: LifeProfileComponent;
  let fixture: ComponentFixture<LifeProfileComponent>;
  let service: { save: (profile: any) => any; get?: (userId: string) => any; getVillageState?: (userId: string) => any };

  beforeEach(async () => {
    service = {
      save: () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' }),
      get: () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' }),
      getVillageState: () => of({
        villageId: 'demo-village',
        population: 10,
        resources: { food: 100, wood: 80, stone: 60 },
        structures: [],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LifeProfileComponent, GrowthMapComponent],
      providers: [{ provide: LifeProfileService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should invalidate form with missing required fields', () => {
    component.form.setValue({ firstName: '', lastName: '', age: null, preferredRole: 'member' });
    component.onSubmit();

    expect(component.form.invalid).toBeTruthy();
    expect(service.save).toBeDefined();
  });

  it('should submit valid profile and show saved message', () => {
    let callCount = 0;
    service.save = () => {
      callCount++;
      return of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' });
    };
    if (!service.get) {
      service.get = () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' });
    }

    if (!service.getVillageState) {
      service.getVillageState = () => of({
        villageId: 'demo-village',
        population: 10,
        resources: { food: 100, wood: 80, stone: 60 },
        structures: [],
      });
    }

    component.form.setValue({ firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' });
    component.onSubmit();

    expect(callCount).toBe(1);
    expect(component.saved).toBe(true);
    expect(component.error).toBe(false);
  });

  it('should show error when save fails', () => {
    service.save = () => throwError(() => new Error('fail'));

    component.form.setValue({ firstName: 'Jane', lastName: 'Smith', age: 28, preferredRole: 'member' });
    component.onSubmit();

    expect(component.saved).toBe(false);
    expect(component.error).toBe(true);
  });

  it('should render GrowthMapComponent when villageState is loaded', () => {
    const villageState = {
      structures: [{ id: 's1', name: 'Campfire', lifeArea: 'fun', level: 2, progress: 80, unlocked: true }],
      totalProgress: 80,
      updatedAt: new Date().toISOString(),
    };

    service.save = () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' });
    service.get = () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' });
    service.getVillageState = () => of(villageState);

    component.form.setValue({ firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.villageState).toEqual(villageState);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.growth-map')).not.toBeNull();
    expect(compiled.textContent).toContain('Campfire (Level 2)');
  });
});
