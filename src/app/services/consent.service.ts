import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { effect } from '@angular/core'; // Import effect

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  private readonly localStorageKey = 'userConsentKasaiTech'; // Use a specific key

  // Use Angular Signals for reactive state management
  // Initialize consent status by checking localStorage ONLY if in browser
  consentGiven = signal<boolean | null>(this.getInitialConsentState());

  // Signal to control banner visibility
  showBanner = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Determine initial banner visibility only in browser
    if (isPlatformBrowser(this.platformId)) {
        if (this.consentGiven() === null) {
            this.showBanner.set(true); // Show banner if no decision has been made
            console.log('ConsentService: No prior consent decision found. Showing banner.');
        } else {
            console.log(`ConsentService: Prior consent decision found: ${this.consentGiven()}. Banner hidden.`);
        }

        // Use effect to reactively save consent state to localStorage when it changes
        // This runs only in the browser.
        effect(() => {
            const currentConsent = this.consentGiven();
            console.log(`ConsentService: Consent state changed to: ${currentConsent}`);
            // Only save if the user has made a choice (true or false)
            if (currentConsent !== null) {
                try {
                    // Save the user's choice (true or false)
                    localStorage.setItem(this.localStorageKey, JSON.stringify(currentConsent));
                    console.log(`ConsentService: Consent state (${currentConsent}) saved to localStorage.`);
                    // Hide the banner once a choice is made
                    this.showBanner.set(false);
                } catch (e) {
                    console.error('ConsentService: Error writing consent state to localStorage', e);
                }
            }
        }); // Signal writes are always allowed in effects (allowSignalWrites is deprecated)
    }
  }

  private getInitialConsentState(): boolean | null {
    if (isPlatformBrowser(this.platformId)) {
        try {
            const storedValue = localStorage.getItem(this.localStorageKey);
            if (storedValue === null) {
                return null; // No consent decision stored yet
            }
            const consent = JSON.parse(storedValue);
            // Check if it's explicitly true or false
            if (typeof consent === 'boolean') {
                console.log(`ConsentService: Initial consent state loaded from localStorage: ${consent}`);
                return consent;
            }
            // If stored value is not a boolean, treat as null (no valid decision)
            return null;
          } catch (e) {
              console.error('ConsentService: Error reading consent state from localStorage', e);
              // Fallback: If reading fails, act as if no consent is stored
              return null;
          }
      }
      // Server-side or if not in browser, assume no consent decision yet
      return null;
  }

  /**
   * Call this method when the user accepts the use of cookies/localStorage.
   */
  acceptConsent(): void {
    console.log('ConsentService: User accepted consent.');
    this.consentGiven.set(true);
  }

   /**
   * Optional: Call this method if you add a "Decline" option.
   */
  declineConsent(): void {
    console.log('ConsentService: User declined consent.');
    // Set consent to false. Also clear any previously stored functional data.
    this.consentGiven.set(false);
    if (isPlatformBrowser(this.platformId)) {
        try {
            console.log('ConsentService: Clearing functional data due to declined consent.');
            localStorage.removeItem('theme'); // Remove theme preference
            localStorage.removeItem('skipExternalLinkWarning'); // Remove link warning preference
        } catch (e) {
            console.error('ConsentService: Error clearing functional data from localStorage', e);
        }
    }
  }

  /**
   * Checks if the user has given consent.
   * For use by other services before accessing localStorage.
   * Returns false if consent is null (not decided yet) or explicitly false.
   */
  hasConsent(): boolean {
    // Treat null (undecided) as false for functional storage access
    return this.consentGiven() === true;
  }
}