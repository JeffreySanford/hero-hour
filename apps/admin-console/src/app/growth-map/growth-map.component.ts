import { Component, Input } from '@angular/core';
import type { VillageState } from '@org/api-interfaces';

@Component({
  selector: 'app-growth-map',
  templateUrl: './growth-map.component.html',
  styleUrls: ['./growth-map.component.scss'],
  standalone: false
})
export class GrowthMapComponent {
  @Input() villageState: VillageState | null = null;

  structureLabel(structure: any): string {
    return `${structure.name} (Level ${structure.level})`;
  }
}
