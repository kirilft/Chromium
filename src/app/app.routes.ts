/* app.routes.ts */
import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: MainComponent }, // Main path for the root
  { path: 'main', redirectTo: '', pathMatch: 'full' }, // Redirect from 'main' to root

  { path: '**', component: PageNotFoundComponent } // Catch-all for undefined routes
];
