/* src/app/app.routes.ts */
import { Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { PageNotFoundComponent } from './Pages/page-not-found/page-not-found.component';
import { ArcComponent } from './Pages/arc/arc.component';
import { GalleryComponent } from './Pages/gallery/gallery.component';
import { ImpressumComponent } from './Pages/impressum/impressum.component'; // Import Impressum
import { KasaiComponent } from './Pages/kasai/kasai.component'; // Import KasaiComponent

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: 'Kasai Tech | Kiri\'s Experimental Web Platform', // Slightly refined title
      // Added description
      description: 'Welcome to Kasai Tech, Kiri\'s experimental space for Angular development, web design exploration, and showcasing creative projects like the Arc Squircle Generator and photography.'
    }
  },
  {
    path: 'main', // Keep redirect, no metadata needed here
    redirectTo: '',
    pathMatch: 'full'
  },
   { path: 'kasai', component: KasaiComponent },
  {
    path: 'arc',
    component: ArcComponent,
    data: {
      title: 'Arc Squircle Generator | Kasai Tech Tools', // Added title
      // Added description
      description: 'Generate custom squircles (superellipses) with the interactive Arc tool. Adjust parameters like n and border-radius in various units (px, rem, etc.).'
    }
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    data: {
      title: 'Photography Gallery | Kasai Tech', // Added title
      // Added description
      description: 'Explore a gallery of moments captured by Kiri using a Fujifilm X-T4. Discover unique perspectives and scenes from Austria and beyond.'
    }
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
    data: {
      title: 'Impressum | Legal Notice | Kasai Tech', // Added title
      // Added description
      description: 'Legal notice and contact information (Impressum) for Kasai Tech, operated by Kiri Yo Wasted, Mank, Austria.'
    }
  },
  {
    path: '**', // Catch-all
    component: PageNotFoundComponent,
    data: {
      title: '404 - Page Not Found | Kasai Tech', // Added title
      // Added description
      description: 'Oops! The page you were looking for could not be found on Kasai Tech. Please check the URL or navigate back home.'
    }
  }
];
