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
  // n slider value
  n: number = 4;
  // Border radius value for the squircle’s top-left corner
  borderRadius: number = 142;
  // Current measurement unit
  measurement: string = 'px';
  // Options available for measurement
  measurementOptions: string[] = ['px', 'mm', 'cm', 'rem', 'inch'];

  // Fixed squircle height in pixels
  private squareHeightPx: number = 453.147;

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
    return this.squareHeightPx * factor;
  }
}
