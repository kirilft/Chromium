import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Note: Title setting is now handled declaratively in app.routes.ts via the `title` property.
// The programmatic approach using Router events and Title service is no longer needed
// unless more complex dynamic title logic is required.

@Component({
  selector: 'app-root', // The root element selector for the application
  standalone: true, // Marks this as a standalone component
  imports: [
    RouterOutlet // Provides the directive needed to render routed components
  ],
  templateUrl: './app.component.html', // Link to the component's HTML template
  styleUrls: ['./app.component.css'] // Link to the component's CSS styles
})
export class AppComponent {
  // No explicit title logic needed here anymore if using the router's `title` property.
  // Angular's default TitleStrategy handles it based on the route configuration.

  // Constructor and ngOnInit can be removed if they are empty.
  // constructor() {}
  // ngOnInit(): void {}
}
