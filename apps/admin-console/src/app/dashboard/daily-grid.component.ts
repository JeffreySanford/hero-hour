import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type ActivityType = 'work' | 'exercise' | 'social' | 'rest';

export interface DayGridCell {
  index: number;
  activity?: ActivityType;
  label?: string;
  completed: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-daily-grid',
  templateUrl: './daily-grid.component.html',
  styleUrls: ['./daily-grid.component.scss'],
})
export class DailyGridComponent {
  private _cells: DayGridCell[] = [];
  @Input() reducedMotion = false;

  @Input()
  set cells(value: DayGridCell[]) {
    this._cells = value || [];
    this.rows = this.groupIntoRows(this._cells, 6);
  }

  get cells(): DayGridCell[] {
    return this._cells;
  }

  rows: DayGridCell[][] = [];

  groupIntoRows(cells: DayGridCell[], perRow: number): DayGridCell[][] {
    const rows: DayGridCell[][] = [];
    for (let i = 0; i < cells.length; i += perRow) {
      rows.push(cells.slice(i, i + perRow));
    }
    return rows;
  }

  getIndicatorClass(cell: DayGridCell): string {
    if (!cell.activity) {
      return 'empty';
    }

    const activityClass = `activity-${cell.activity}`;
    return cell.completed ? `${activityClass} completed` : activityClass;
  }

  getAriaLabel(cell: DayGridCell): string {
    if (!cell.activity) {
      return `Slot ${cell.index + 1}: empty`;
    }
    const state = cell.completed ? 'completed' : 'active';
    return `Slot ${cell.index + 1}: ${cell.activity} (${state})`;
  }
}
