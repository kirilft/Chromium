import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core'; // Added inject
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ConsentService } from './consent.service'; // Import ConsentService

@Injectable({
  providedIn: 'root'
})
export class ExternalLinkService {
  private readonly localStorageKey = 'skipExternalLinkWarning';

  private _showWarning = new BehaviorSubject<boolean>(false);
  public showWarning$ = this._showWarning.asObservable();

  private _targetUrl = new BehaviorSubject<string | null>(null);
  public targetUrl$ = this._targetUrl.asObservable();

  // Inject ConsentService
  private consentService = inject(ConsentService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  checkAndProceed(url: string | null): void {
    if (!url) {
      console.error('ExternalLinkService: No URL provided.');
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      // Check consent BEFORE deciding based on preference
      if (this.consentService.hasConsent() && this.getSkipPreference()) {
        // User has opted out AND consent is given, navigate directly
        console.log('ExternalLinkService: Skipping warning based on preference (consent given).');
        this._navigate(url);
      } else {
        // User has not opted out OR no consent given, show the warning
        console.log('ExternalLinkService: Showing warning for URL (preference not set, or no consent):', url);
        this.showWarning(url);
      }
    } else {
      console.warn('ExternalLinkService: External link navigation attempted outside browser environment for URL:', url);
    }
  }

  private showWarning(url: string): void {
    this._targetUrl.next(url);
    this._showWarning.next(true);
  }

  hideWarning(): void {
    this._showWarning.next(false);
    this._targetUrl.next(null);
    console.log('ExternalLinkService: Warning hidden.');
  }

  proceed(rememberPreference: boolean): void {
    const url = this._targetUrl.value;
    if (url) {
      console.log(`ExternalLinkService: Proceeding to ${url}. Remember preference checkbox state: ${rememberPreference}`);
      // Only save preference if checkbox is checked AND consent is given
      if (rememberPreference && this.consentService.hasConsent()) {
        this.setSkipPreference(true);
      } else if (rememberPreference && !this.consentService.hasConsent()) {
        console.log('ExternalLinkService: Cannot save skip preference (no consent).');
      }
      this.hideWarning();
      this._navigate(url);
    } else {
      console.error('ExternalLinkService: Proceed called but no target URL set.');
      this.hideWarning();
    }
  }

  /** Reads preference from localStorage - ONLY call if consent is granted */
  private getSkipPreference(): boolean {
    if (isPlatformBrowser(this.platformId)) {
        // **Caller (checkAndProceed) MUST ensure consent is given before calling this**
        try {
          const preference = localStorage.getItem(this.localStorageKey);
          return preference === 'true';
        } catch (e) {
          console.error('ExternalLinkService: Error reading skip preference from localStorage', e);
          return false;
        }
    }
    return false;
  }

  /** Writes preference to localStorage - ONLY call if consent is granted */
  private setSkipPreference(skip: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      // **Caller (proceed) MUST ensure consent is given before calling this**
      try {
        localStorage.setItem(this.localStorageKey, String(skip));
        console.log(`ExternalLinkService: Skip preference saved: ${skip} (consent given).`);
      } catch (e) {
        console.error('ExternalLinkService: Error writing skip preference to localStorage', e);
      }
    }
  }

  private _navigate(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        window.open(url, '_blank', 'noopener noreferrer');
      } catch (e) {
        console.error(`ExternalLinkService: Error opening URL ${url}`, e);
      }
    }
  }
}