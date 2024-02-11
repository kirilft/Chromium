// src/app/kasai/kasai.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { KasaiComponent } from './kasai.component';
import { SharedModule } from '../shared/shared.module'; // Import SharedModule

const routes: Routes = [
  {
    path: '',
    component: KasaiComponent
  }
];

@NgModule({
  declarations: [
    KasaiComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule // Import SharedModule here
  ]
})
export class KasaiModule { }
