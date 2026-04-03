import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrowthMapComponent } from './growth-map.component';

describe('GrowthMapComponent', () => {
  let component: GrowthMapComponent;
  let fixture: ComponentFixture<GrowthMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrowthMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrowthMapComponent);
    component = fixture.componentInstance;
  });

  it('renders unlocked and locked structures with progress', () => {
    component.villageState = {
      structures: [
        { id: 's1', name: 'Campfire', lifeArea: 'fun', level: 1, progress: 40, unlocked: true },
        { id: 's2', name: 'Garden', lifeArea: 'health', level: 1, progress: 10, unlocked: false },
      ],
      totalProgress: 50,
      updatedAt: new Date().toISOString(),
    } as any;
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    expect(native.textContent).toContain('Campfire (Level 1)');
    expect(native.textContent).toContain('Garden (Level 1)');
    expect(native.textContent).toContain('Total progress: 50');
  });
});
