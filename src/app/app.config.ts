import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import for animations

import { routes } from './app.routes'; // Application routes

/**
 * Application configuration object.
 * Defines providers and settings for the Angular application.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // -- Router Configuration --
    provideRouter(
      routes,
      // Enable binding router information (params, data, queryParams) to component inputs
      withComponentInputBinding(),
      // Configure scroll restoration behavior
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // Restore scroll position on navigation
        anchorScrolling: 'enabled', // Enable scrolling to anchors
      }),
      // Additional router configurations if needed
      // withRouterConfig({
      //   onSameUrlNavigation: 'reload', // Example: Reload component on same URL navigation
      // })
    ),

    // -- Browser Platform Features --
    // Enable client-side hydration for smoother SSR transitions
    provideClientHydration(),
    // Enable Angular Animations
    provideAnimations(), // Required for animations defined in components (like MainComponent)

    // -- Service Worker (PWA) --
    provideServiceWorker('ngsw-worker.js', {
      // Enable the service worker in production mode only
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // -- Other Application-Wide Providers (if any) --
    // Example: provideHttpClient(withFetch()), // If using HttpClient
    // importProvidersFrom(ModuleIfNeeded) // If needing providers from an NgModule
  ]
};
