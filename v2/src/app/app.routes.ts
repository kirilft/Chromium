import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component'; // Import the MainComponent

export const routes: Routes = [
  { path: '', component: MainComponent }, // Set up the 'main' route
  { path: 'main', redirectTo: '', pathMatch: 'full' } // Optional: Redirect the default route to 'main'
];
