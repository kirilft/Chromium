// src/app/components/external-link-warning/external-link-warning.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core'; // Added inject
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ExternalLinkService } from '../../services/external-link.service';
import { ConsentService } from '../../services/consent.service'; // Import ConsentService

@Component({
  selector: 'app-external-link-warning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './external-link-warning.component.html',
  styleUrls: ['./external-link-warning.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalLinkWarningComponent {
  // Inject services
  private externalLinkService = inject(ExternalLinkService);
  private consentService = inject(ConsentService); // Inject ConsentService

  // Observables directly from the service
  showWarning$: Observable<boolean>;
  targetUrl$: Observable<string | null>;

  // Expose consent status signal to the template
  hasConsent = this.consentService.consentGiven; // Use consentGiven directly

  // Local state for the checkbox
  rememberPreference: boolean = false;

  constructor() { // Remove ExternalLinkService from constructor if only using inject
    // Assign observables from the service
    this.showWarning$ = this.externalLinkService.showWarning$;
    this.targetUrl$ = this.externalLinkService.targetUrl$;
  }

  onProceed(): void {
    console.log('WarningComponent: Proceed clicked.');
    // Pass checkbox state, service will check consent before saving
    this.externalLinkService.proceed(this.rememberPreference);
  }

  onCancel(): void {
    console.log('WarningComponent: Cancel clicked.');
    this.externalLinkService.hideWarning();
    // Reset checkbox state when cancelling
    this.rememberPreference = false;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}