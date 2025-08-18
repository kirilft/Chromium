/* src/app/app.routes.ts */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
  loadComponent: () => import('./Pages/main/main.component').then(m => m.MainComponent),
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
  loadComponent: () => import('./Pages/kasai/kasai.component').then(m => m.KasaiComponent),
    data: {
      title: 'Kasai Overview | Kasai Tech',
      description: 'Learn about the Kasai home-lab project: system architecture, hosted services, and how Kiri structured her experimental server environment.'
    }
  },
  {
    path: 'arc',
  loadComponent: () => import('./Pages/arc/arc.component').then(m => m.ArcComponent),
    data: {
      title: 'Arc Squircle Generator | Kasai Tech Tools',
      description: 'Generate custom squircles (superellipses) with the interactive Arc tool. Adjust parameters like exponent (n) and border radius in px, rem, and more.'
    }
  },
  {
    path: 'gallery',
  loadComponent: () => import('./Pages/gallery/gallery.component').then(m => m.GalleryComponent),
    data: {
      title: 'Photography Gallery | Kasai Tech',
      description: 'Explore moments captured by Kiri with a Fujifilm X-T4—unique perspectives from Austria and beyond.'
    }
  },
  {
    path: 'projects',
    loadComponent: () => import('./Pages/projects/projects.component').then(m => m.ProjectsComponent),
    data: {
      title: 'Projects | Kasai Tech',
      description: 'A curated list of experiments, utilities, and works-in-progress built by Kasai Technologies.'
    }
  },
  {
    path: 'projects/color',
    loadComponent: () => import('./Pages/projects/color/color.component').then(m => m.ProjectColorComponent),
    data: {
      title: 'Color | Kasai Projects',
      description: 'Color experiments: palettes, contrast, tokens, and theming.'
    }
  },
  {
    path: 'projects/audio',
    loadComponent: () => import('./Pages/projects/audio/audio.component').then(m => m.ProjectAudioComponent),
    data: {
      title: 'Audio | Kasai Projects',
      description: 'Web audio experiments, effects, and visualization.'
    }
  },
  {
    path: 'projects/astrophotography',
    loadComponent: () => import('./Pages/projects/astrophotography/astrophotography.component').then(m => m.ProjectAstrophotographyComponent),
    data: {
      title: 'Astrophotography | Kasai Projects',
      description: 'Capture, stack, and process the night sky with tools and guides.'
    }
  },
  {
    path: 'impressum',
  loadComponent: () => import('./Pages/impressum/impressum.component').then(m => m.ImpressumComponent),
    data: {
      title: 'Impressum | Legal Notice | Kasai Tech',
      description: 'Legal notice and contact information for Kasai Tech, operated by Kiri Yo Wasted, Mank, Austria.'
    }
  },
  {
    path: 'services',
  loadComponent: () => import('./Pages/available-services/available-services.component').then(m => m.AvailableServicesComponent),
    data: {
      title: 'Available Services | Kasai Tech',
      description: 'Browse all available services in the Kasai Tech Angular app.'
    }
  },
  {
    path: '**',
  loadComponent: () => import('./Pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent),
    data: {
      title: '404 - Page Not Found | Kasai Tech',
      description: 'Oops! The page you’re looking for cannot be found on Kasai Tech. Please check the URL or head back home.'
    }
  }
];
