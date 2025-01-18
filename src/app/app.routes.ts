/* app.routes.ts */
import { Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { BlauwalComponent } from './Pages/blauwal/blauwal.component';
import { ArcComponent } from './Pages/arc/arc.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { title: 'Kasai - Home Page' }
  }, // Main path for the root
  {
    path: 'main',
    redirectTo: '',
    pathMatch: 'full'
  }, // Redirect from 'main' to root
  {
    path: 'blauwal',
    component: BlauwalComponent
  },
  {
    path: 'arc',
    component: ArcComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { title: '404 - Page Not Found' }
  } // Catch-all for undefined routes
];
