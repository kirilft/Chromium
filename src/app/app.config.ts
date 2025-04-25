// src/app/app.config.ts
import { ApplicationConfig, isDevMode } from '@angular/core';
// Import router features
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
// import { provideServiceWorker } from '@angular/service-worker'; // <-- SERVICE WORKER REMOVED
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
            scrollPositionRestoration: 'enabled', // Restores scroll position on navigation
            anchorScrolling: 'enabled', // Enables scrolling to anchor fragments
        })
    ),

    // Client Hydration for better SSR integration
    provideClientHydration(),

    // Animations support
    provideAnimations(),

    // HTTP Client with modern fetch API support
    provideHttpClient(withFetch()),

    // Service Worker - REMOVED FOR AGGRESSIVE BROWSER CACHING
    // The service worker registration has been removed to prevent potential
    // conflicts with standard browser HTTP caching mechanisms.
    // This ensures the browser relies solely on Cache-Control headers,
    // which are correctly configured for long-term caching on your server.
    /*
    provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(), // Only enable in production
            registrationStrategy: 'registerWhenStable:30000' // Register after app stabilizes
          })
    */
    ]
};
