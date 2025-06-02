import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard'; // Import Clipboard service

@Component({
  standalone: true,
  selector: 'app-arc',
  templateUrl: './arc.component.html', // Uses arc_component_html_final
  styleUrls: ['./arc.component.css'],   // Uses arc_component_css_final
  imports: [CommonModule, FormsModule],
  providers: [Clipboard] // Provide Clipboard service locally
})
export class ArcComponent {

  // --- Inputs for Calculation ---
  productWidth = signal<number>(300);
  productHeight = signal<number>(200);
  cornerSmoothing = signal<number>(60);
  measurement = signal<string>('px'); // Measurement unit for calculation output AND display

  // --- Copy State ---
  copySuccess = signal<boolean>(false);

  // --- Internal Calculation ---
  n = computed(() => {
    const smoothing = this.cornerSmoothing();
    // Ensure n is at least 2 (ellipse/circle) and increases as smoothing decreases
    return Math.max(2, 2 + (8 * (1 - smoothing / 100)));
  });

  // Conversion factors based on selected measurement unit for the *output*
  private pxPerUnit = computed(() => {
    const unit = this.measurement();
    switch (unit) {
      case 'mm': return 3.7795; // Approx 96dpi / 25.4
      case 'cm': return 37.795; // Approx 96dpi / 2.54
      case 'inch': return 96;
      case 'rem': return 16;    // Assuming default 1rem = 16px
      case 'px':
      default: return 1;
    }
  });

  private unitsPerPx = computed(() => 1 / this.pxPerUnit());

  // --- Calculated Output Radius (based on inputs) ---
  calculatedBorderRadius = computed(() => {
    const nVal = this.n();
    // Use the *input* dimensions for calculation, converted to px relative to the selected unit
    const widthPx = this.productWidth() * this.pxPerUnit();
    const heightPx = this.productHeight() * this.pxPerUnit();
    const unitsPerPxVal = this.unitsPerPx(); // Factor to convert result back to chosen unit

    // Prevent division by zero or invalid inputs
    if (widthPx <= 0 || heightPx <= 0 || nVal < 2) {
      return 0;
    }

    const a = widthPx / 2; // Semi-axis x in px
    const b = heightPx / 2; // Semi-axis y in px
    const cos45 = Math.SQRT1_2;
    const sin45 = Math.SQRT1_2;

    // Calculate the point on the superellipse curve at 45 degrees from the axes
    const x45 = a * Math.pow(cos45, 2 / nVal);
    const y45 = b * Math.pow(sin45, 2 / nVal);

    // Approximate the CSS radius based on the distance from the corner to the 45-degree point
    const maxRadiusPx = Math.min(a, b); // Max possible radius in px
    const radiusPx = Math.min(a - x45, b - y45); // Calculated radius in px
    const clampedRadiusPx = Math.max(0, Math.min(radiusPx, maxRadiusPx));

    // Convert the calculated radius (which is in px equivalent) back to the selected measurement unit
    const radiusInUnits = clampedRadiusPx * unitsPerPxVal;

    // Round to a reasonable number of decimal places
    return parseFloat(radiusInUnits.toFixed(2));
  });

  // --- Computed CSS String for Copying ---
  // This still represents the radius applied to all corners for practical use
  borderRadiusCssString = computed(() => {
    return `border-radius: ${this.calculatedBorderRadius()}${this.measurement()};`;
  });

  // --- Style for the Fixed Display Squircle ---
  // *** MODIFIED: Apply radius only to top-left corner ***
  displaySquircleStyle = computed(() => {
      const radius = this.calculatedBorderRadius();
      const unit = this.measurement(); // Use the selected unit for display consistency
      // Use the border-radius shorthand to apply only to top-left
      return {
          'border-radius': `${radius}${unit} 0 0 0`
      };
  });


  // --- Available Units ---
  measurementOptions: string[] = ['px', 'rem', 'mm', 'cm', 'inch'];

  constructor(private clipboard: Clipboard) {}

  // --- Copy Method ---
  copyRadius(): void {
    // Copy the full border-radius string (for all corners)
    const cssToCopy = this.borderRadiusCssString();
    const success = this.clipboard.copy(cssToCopy);

    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => {
        this.copySuccess.set(false);
      }, 1500);
    } else {
      console.error('Failed to copy CSS to clipboard.');
    }
  }
}
