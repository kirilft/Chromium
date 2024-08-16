import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';


export const routes: Routes = [
  { path: 'main', component: MainComponent }, // Changed from redirect to component
  { path: '', redirectTo: 'main', pathMatch: 'full' } // Changed from component to redirect
];
