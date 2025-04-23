import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Root application component
import { config } from './app/app.config.server'; // Server-specific application configuration

/**
 * Bootstraps the Angular application for server-side rendering (SSR).
 * This function is typically called by the Node.js server hosting the Angular Universal app.
 * @returns A Promise resolving to the ApplicationRef instance.
 */
const bootstrap = () => bootstrapApplication(AppComponent, config);

// Export the bootstrap function as the default export for the server environment.
export default bootstrap;
