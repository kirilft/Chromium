import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ArcComponent {
  // n slider value (initialized to 4 which is a typical squircle)
  private _n: number = 4;
  get n(): number { return this._n; }
  set n(value: number) {
    this._n = value;
    // When n changes, update border radius without creating an infinite loop
    this.syncingValues = true;
    this.borderRadius = this.calculateBorderRadiusFromN(value);
    setTimeout(() => this.syncingValues = false, 0);
  }
  
  // Border radius value
  private _borderRadius: number = 142;
  get borderRadius(): number { return this._borderRadius; }
  set borderRadius(value: number) {
    this._borderRadius = value;
    // When border radius changes, update n without creating an infinite loop
    if (!this.syncingValues) {
      this.syncingValues = true;
      this._n = this.calculateNFromBorderRadius(value);
      setTimeout(() => this.syncingValues = false, 0);
    }
  }
  
  // Flag to prevent infinite loop when updating values
  private syncingValues: boolean = false;
  
  // Current measurement unit
  measurement: string = 'px';
  // Options available for measurement
  measurementOptions: string[] = ['px', 'mm', 'cm', 'rem', 'inch'];

  // Fixed squircle dimensions in pixels
  private squircleWidthPx: number = 616.989;
  private squircleHeightPx: number = 453.147;

  // Compute max border radius in the current measurement unit
  get maxBorderRadius(): number {
    const conversionFactors: { [unit: string]: number } = {
      'px': 1,
      'mm': 0.264583,
      'cm': 0.0264583,
      'inch': 1 / 96, // ~0.0104167
      'rem': 1 / 16   // 0.0625
    };
    const factor = conversionFactors[this.measurement] || 1;
    // The max border radius is half the minimum dimension
    return Math.min(this.squircleWidthPx, this.squircleHeightPx) / 2 * factor;
  }
  
  // Calculate border radius based on n value
  calculateBorderRadiusFromN(n: number): number {
    // For a superellipse, we need both semi-axes
    const a = this.squircleWidthPx / 2;
    const b = this.squircleHeightPx / 2;
    
    // The angle for corner approximation
    const cos45 = Math.sqrt(2) / 2;
    const sin45 = cos45; // Same at 45°
    
    // Calculate the point on the superellipse at 45°
    const x45 = a * Math.pow(Math.abs(cos45), 2 / n);
    const y45 = b * Math.pow(Math.abs(sin45), 2 / n);
    
    // Calculate the distance from the bounding box corner
    const dx = a - x45;
    const dy = b - y45;
    
    // For a rectangle, we use the distance to the curve at 45°
    // which is approximated as the minimum of dx and dy
    const radiusPx = Math.max(0, Math.min(dx, dy));
    
    // Convert to current measurement unit
    const conversionFactors: { [unit: string]: number } = {
      'px': 1,
      'mm': 0.264583,
      'cm': 0.0264583,
      'inch': 1 / 96,
      'rem': 1 / 16
    };
    const factor = conversionFactors[this.measurement] || 1;
    
    return radiusPx * factor;
  }
  
  // Calculate n value based on border radius
  calculateNFromBorderRadius(borderRadius: number): number {
    // Convert border radius to px for calculation
    const conversionFactors: { [unit: string]: number } = {
      'px': 1,
      'mm': 1 / 0.264583,
      'cm': 1 / 0.0264583,
      'inch': 96,
      'rem': 16
    };
    const factor = conversionFactors[this.measurement] || 1;
    const borderRadiusPx = borderRadius * factor;
    
    // For a superellipse, we need both semi-axes
    const a = this.squircleWidthPx / 2;
    const b = this.squircleHeightPx / 2;
    
    // Check for edge cases
    if (borderRadiusPx <= 0) {
      return 10; // Very square-like
    } else if (borderRadiusPx >= Math.min(a, b)) {
      return 2;  // Perfect circle/ellipse
    }
    
    // For calculating n, we need to use the special point on the curve at 45°
    // where the border radius approximates the curve
    const cos45 = Math.sqrt(2) / 2;
    
    // We need to solve for n where:
    // (a - r) = a * |cos45|^(2/n) and (b - r) = b * |sin45|^(2/n)
    // This gives us: (a - r)/a = |cos45|^(2/n)
    
    // We use the more constraining dimension (smaller ratio)
    const ratioA = (a - borderRadiusPx) / a;
    const ratioB = (b - borderRadiusPx) / b;
    
    // Use the larger ratio (smaller semi-axis adjusts more)
    const ratio = Math.max(ratioA, ratioB);
    
    // Solve for n: ratio = |cos45|^(2/n)
    // So: n = 2 * log(cos45) / log(ratio)
    const n = 2 * Math.log(cos45) / Math.log(ratio);
    
    // Clamp n between 2 and 10 for reasonable values
    return Math.max(2, Math.min(10, isNaN(n) ? 4 : n));
  }
}