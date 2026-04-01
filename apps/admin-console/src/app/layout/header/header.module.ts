import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { headerRoutes } from './header.router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, RouterModule.forChild(headerRoutes)],
  exports: [HeaderComponent],
})
export class HeaderModule {}
