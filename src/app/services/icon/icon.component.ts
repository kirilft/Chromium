import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * A simple component to display an SVG icon from the assets folder.
 */
@Component({
  selector: 'app-icon', // Component selector
  standalone: true, // Standalone component
  imports: [], // No dependencies needed in the template
  templateUrl: './icon.component.html', // Link to the HTML template
  styleUrl: './icon.component.css', // Link to the CSS styles
  changeDetection: ChangeDetectionStrategy.OnPush // Use OnPush for better performance
})
// Add the 'export' keyword here!
export class IconComponent {
  /**
   * The name of the icon file (without the .svg extension).
   * Example: 'sun', 'moon'
   */
  @Input({ required: true }) name!: string; // Mark 'name' as required

  /**
   * Alternative text for the icon image, crucial for accessibility.
   * Defaults to "Icon" if not provided, but should be descriptive.
   */
  @Input() alt: string = 'Icon'; // Provide a default

  /**
   * Computes the full path to the SVG icon file.
   * @returns The path string.
   */
  get iconUrl(): string {
    // Use template literals for cleaner path construction
    return `assets/icons/${this.name}.svg`;
  }
}
