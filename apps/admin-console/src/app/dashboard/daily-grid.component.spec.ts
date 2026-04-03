import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyGridComponent, DayGridCell } from './daily-grid.component';

describe('DailyGridComponent', () => {
  let component: DailyGridComponent;
  let fixture: ComponentFixture<DailyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state when no cells', () => {
    component.cells = [];
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.daily-grid__empty');
    expect(empty).toBeTruthy();
  });

  it('should render work and completed cell with correct class', () => {
    const cells: DayGridCell[] = [
      { index: 0, activity: 'work', completed: false },
      { index: 1, activity: 'exercise', completed: true },
    ];
    component.cells = cells;
    fixture.detectChanges();

    const cellElements = fixture.nativeElement.querySelectorAll('.daily-grid__cell');
    expect(cellElements.length).toBe(2);
    expect(cellElements[0].classList).toContain('activity-work');
    expect(cellElements[1].classList).toContain('activity-exercise');
    expect(cellElements[1].classList).toContain('completed');
  });
});