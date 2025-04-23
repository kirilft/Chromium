import { Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { ArcComponent } from './Pages/arc/arc.component';
import { GalleryComponent } from './Pages/gallery/gallery.component';

/**
 * Defines the application's routes.
 * Maps URL paths to specific components and associated data.
 */
export const routes: Routes = [
  {
    path: '', // Root path
    component: MainComponent,
    title: 'Kasai - Home Page' // Set page title using the built-in TitleStrategy
    // Consider adding 'pathMatch: 'full'' if there are child routes later
  },
  {
    path: 'main', // Legacy or alternative path for home
    redirectTo: '', // Redirect '/main' to the root path '/'
    pathMatch: 'full' // Ensure the entire path matches before redirecting
  },
  {
    path: 'arc', // Path for the Arc component
    component: ArcComponent,
    title: 'Kasai - Arc Squircle Generator' // Specific title for this page
  },
  {
    path: 'gallery', // Path for the Gallery component
    component: GalleryComponent,
    title: 'Kasai - Gallery' // Specific title for this page
    // Potential Improvement: Lazy Loading
    // For larger applications, consider lazy loading feature modules/components:
    // {
    //   path: 'gallery',
    //   loadComponent: () => import('./Pages/gallery/gallery.component').then(m => m.GalleryComponent),
    //   title: 'Kasai - Gallery'
    // },
  },
  {
    path: '**', // Wildcard route for any paths not matched above
    component: PageNotFoundComponent,
    title: '404 - Page Not Found' // Title for the 404 page
  }
];
