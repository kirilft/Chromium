import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { SharedModule } from '../shared/shared.module'; // Assuming SharedModule exports HeaderComponent and FooterComponent

@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule // Import SharedModule to use HeaderComponent and FooterComponent
  ]
})
export class PageNotFoundModule { }
