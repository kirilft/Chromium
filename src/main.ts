import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Main application configuration
import { AppComponent } from './app/app.component'; // Root application component

/**
 * Bootstraps the Angular application in the browser environment.
 * Uses the AppComponent as the root component and appConfig for configuration.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Application bootstrap error:', err)); // Log any bootstrap errors
