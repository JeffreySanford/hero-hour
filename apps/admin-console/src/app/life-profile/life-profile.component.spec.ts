import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LifeProfileComponent } from './life-profile.component';
import { LifeProfileService } from './life-profile.service';

describe('LifeProfileComponent', () => {
  let component: LifeProfileComponent;
  let fixture: ComponentFixture<LifeProfileComponent>;
  let service: { save: (profile: any) => any; get?: (userId: string) => any };

  beforeEach(async () => {
    service = {
      save: () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' }),
      get: () => of({ userId: 'demo-user', firstName: 'John', lastName: 'Doe', age: 35, preferredRole: 'leader' }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LifeProfileComponent],
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
});
