/* src/app/app.routes.ts */
import { Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { ArcComponent } from './Pages/arc/arc.component';
import { GalleryComponent } from './Pages/gallery/gallery.component';
import { ImpressumComponent } from './Pages/impressum/impressum.component';
import { KasaiComponent } from './Pages/kasai/kasai.component';
import { AvailableServicesComponent } from './Pages/available-services/available-services.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: 'Kasai Tech | Kiri\'s Experimental Web Platform',
      description: 'Welcome to Kasai Tech, Kiri\'s experimental space for Angular development, web design exploration, and showcasing creative projects like the Arc Squircle Generator and photography.'
    }
  },
  {
    path: 'main',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'kasai',
    component: KasaiComponent,
    data: {
      title: 'Kasai Overview | Kasai Tech',
      description: 'Learn about the Kasai home-lab project: system architecture, hosted services, and how Kiri structured her experimental server environment.'
    }
  },
  {
    path: 'arc',
    component: ArcComponent,
    data: {
      title: 'Arc Squircle Generator | Kasai Tech Tools',
      description: 'Generate custom squircles (superellipses) with the interactive Arc tool. Adjust parameters like exponent (n) and border radius in px, rem, and more.'
    }
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    data: {
      title: 'Photography Gallery | Kasai Tech',
      description: 'Explore moments captured by Kiri with a Fujifilm X-T4—unique perspectives from Austria and beyond.'
    }
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
    data: {
      title: 'Impressum | Legal Notice | Kasai Tech',
      description: 'Legal notice and contact information for Kasai Tech, operated by Kiri Yo Wasted, Mank, Austria.'
    }
  },
  {
    path: 'services',
    component: AvailableServicesComponent,
    data: {
      title: 'Available Services | Kasai Tech',
      description: 'Browse all available services in the Kasai Tech Angular app.'
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {
      title: '404 - Page Not Found | Kasai Tech',
      description: 'Oops! The page you’re looking for cannot be found on Kasai Tech. Please check the URL or head back home.'
    }
  }
];
