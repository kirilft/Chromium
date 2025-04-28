import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentService } from '../../services/consent.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent {
  consentService = inject(ConsentService);

  // Expose the signal directly to the template
  showBanner = this.consentService.showBanner;

  accept(): void {
    this.consentService.acceptConsent();
  }

  // Optional: Implement decline logic if you add a decline button
  // decline(): void {
  //   this.consentService.declineConsent();
  // }
}