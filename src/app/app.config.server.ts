import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config'; // Base application config

/**
 * Server-specific application configuration.
 * Merges the base appConfig with providers needed for server-side rendering (SSR).
 */
const serverConfig: ApplicationConfig = {
  providers: [
    // Enable server-side rendering capabilities
    provideServerRendering()
    // Add any other server-specific providers here if needed
  ]
};

/**
 * The final configuration used for bootstrapping the application on the server.
 * Merges the base configuration (`appConfig`) with the server-specific configuration (`serverConfig`).
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
