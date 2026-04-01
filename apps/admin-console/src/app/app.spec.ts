import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterModule } from '@angular/router';
import { ModeService } from './services/mode.service';

import { AppModule } from './app-module';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), AppModule],
    }).compileComponents();
  });

  it('should render router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should render header and footer components', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(compiled.querySelector('app-footer')).not.toBeNull();
  });

  it('should bind mode class to layout container', async () => {
    const fixture = TestBed.createComponent(App);
    const modeService = TestBed.inject(ModeService);

    modeService.setMode('pro');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const appLayout = compiled.querySelector('.app-layout');
    expect(appLayout).not.toBeNull();
    expect(appLayout?.classList.contains('pro')).toBe(true);
  });
});
