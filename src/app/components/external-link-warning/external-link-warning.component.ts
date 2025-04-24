// src/app/components/external-link-warning/external-link-warning.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngIf, async pipe
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)]
import { Observable } from 'rxjs';
import { ExternalLinkService } from '../../services/external-link.service'; // Import the service

@Component({
  selector: 'app-external-link-warning', // Selector to use in app.component.html
  standalone: true,
  imports: [CommonModule, FormsModule], // Import necessary modules
  templateUrl: './external-link-warning.component.html',
  styleUrls: ['./external-link-warning.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Use OnPush for performance
})
export class ExternalLinkWarningComponent {
  // Observables directly from the service
  showWarning$: Observable<boolean>;
  targetUrl$: Observable<string | null>;

  // Local state for the checkbox
  rememberPreference: boolean = false;

  constructor(private externalLinkService: ExternalLinkService) {
    // Assign observables from the service
    this.showWarning$ = this.externalLinkService.showWarning$;
    this.targetUrl$ = this.externalLinkService.targetUrl$;
  }

  /**
   * Called when the "Continue" button is clicked.
   * Tells the service to proceed and passes the checkbox state.
   */
  onProceed(): void {
    console.log('WarningComponent: Proceed clicked.');
    this.externalLinkService.proceed(this.rememberPreference);
  }

  /**
   * Called when the "Cancel" button or overlay background is clicked.
   * Tells the service to hide the warning.
   */
  onCancel(): void {
    console.log('WarningComponent: Cancel clicked.');
    this.externalLinkService.hideWarning();
    // Reset checkbox state when cancelling
    this.rememberPreference = false;
  }

  /**
   * Prevents clicks inside the modal content from propagating
   * to the overlay background and closing the modal unintentionally.
   * @param event The mouse click event.
   */
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
