import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { OddityComponent } from './oddity/oddity.component';

export const routes: Routes = [
  { path: 'main', component: MainComponent }, // Changed from redirect to component
  { path: 'oddity', component: OddityComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' } // Changed from component to redirect
];
