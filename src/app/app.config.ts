import { ApplicationConfig, isDevMode } from '@angular/core';
// Import router features
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
// Import animation providers
import { provideAnimations } from '@angular/platform-browser/animations';
// Import HttpClient providers
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router Configuration with features
    provideRouter(
        routes,
        withComponentInputBinding(),
        withInMemoryScrolling({
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
        })
    ),

    // Client Hydration
    provideClientHydration(),

    // Animations
    provideAnimations(),

    // HTTP Client with fetch API support
    provideHttpClient(withFetch()),

    // Service Worker
    provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
    ]
};
