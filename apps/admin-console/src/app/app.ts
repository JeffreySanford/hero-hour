import { Component } from '@angular/core';
import { ModeService } from './services/mode.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  constructor(public readonly modeService: ModeService) {}

  toggleMode(): void {
    this.modeService.toggleMode();
  }

  get modeLabel(): string {
    return this.modeService.getMode() === 'casual' ? 'Pro' : 'Casual';
  }
}

