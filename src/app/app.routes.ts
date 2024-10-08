/* app.routes.ts */
import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: MainComponent, data:{ title: 'Kasai - Home Page'} }, // Main path for the root
  { path: 'main', redirectTo: '', pathMatch: 'full' }, // Redirect from 'main' to root
  { path: '**', component: PageNotFoundComponent, data:{ title: '404 - Page Not Found'} } // Catch-all for undefined routes
];
