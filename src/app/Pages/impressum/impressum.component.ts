import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component'; // Import Header
import { FooterComponent } from '../../components/footer/footer.component'; // Import Footer
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf etc. if needed

@Component({
  selector: 'app-impressum',
  standalone: true,
  // Import necessary components/modules
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.css']
})
export class ImpressumComponent {
  // Component logic can be added here if needed later
}