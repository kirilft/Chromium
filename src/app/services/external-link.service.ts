// src/app/services/external-link.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service available application-wide
})
export class ExternalLinkService {
  // Key for storing the user's preference in localStorage
  private readonly localStorageKey = 'skipExternalLinkWarning';

  // BehaviorSubject to hold the visibility state of the warning modal
  // Private subject, public observable
  private _showWarning = new BehaviorSubject<boolean>(false);
  public showWarning$ = this._showWarning.asObservable();

  // BehaviorSubject to hold the URL that triggered the warning
  // Private subject, public observable
  private _targetUrl = new BehaviorSubject<string | null>(null);
  public targetUrl$ = this._targetUrl.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Checks if the warning should be shown based on user preference
   * and initiates either direct navigation or shows the warning modal.
   * This is the primary method called by the directive.
   * @param url The external URL to navigate to.
   */
  checkAndProceed(url: string | null): void {
    // Ensure URL is valid
    if (!url) {
      console.error('ExternalLinkService: No URL provided.');
      return;
    }

    // Proceed only in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      if (this.getSkipPreference()) {
        // User has opted out, navigate directly
        console.log('ExternalLinkService: Skipping warning based on preference.');
        this._navigate(url);
      } else {
        // User has not opted out, show the warning
        console.log('ExternalLinkService: Showing warning for URL:', url);
        this.showWarning(url);
      }
    } else {
      // If not in browser (e.g., SSR), maybe just navigate? Or log?
      // For safety, let's just log it for now. Direct navigation might not work server-side.
      console.warn('ExternalLinkService: External link navigation attempted outside browser environment for URL:', url);
      // Optionally, you could attempt direct navigation if applicable in your SSR setup
      // this._navigate(url);
    }
  }

  /**
   * Sets the state to display the warning modal with the target URL.
   * @param url The URL to display in the warning.
   */
  private showWarning(url: string): void {
    this._targetUrl.next(url);
    this._showWarning.next(true);
  }

  /**
   * Sets the state to hide the warning modal and clears the target URL.
   */
  hideWarning(): void {
    this._showWarning.next(false);
    this._targetUrl.next(null);
    console.log('ExternalLinkService: Warning hidden.');
  }

  /**
   * Navigates to the stored target URL and optionally saves the preference.
   * Called by the warning component when the user clicks "Continue".
   * @param rememberPreference Whether to save the "skip warning" preference.
   */
  proceed(rememberPreference: boolean): void {
    const url = this._targetUrl.value; // Get the currently stored URL
    if (url) {
      console.log(`ExternalLinkService: Proceeding to ${url}. Remember preference: ${rememberPreference}`);
      if (rememberPreference) {
        this.setSkipPreference(true);
      }
      this.hideWarning(); // Hide modal before navigating
      this._navigate(url);
    } else {
      console.error('ExternalLinkService: Proceed called but no target URL set.');
      this.hideWarning(); // Hide modal anyway
    }
  }

  /**
   * Reads the user's preference from localStorage.
   * Returns true if the user wants to skip the warning, false otherwise.
   */
  private getSkipPreference(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const preference = localStorage.getItem(this.localStorageKey);
        return preference === 'true';
      } catch (e) {
        console.error('ExternalLinkService: Error reading from localStorage', e);
        return false; // Default to showing the warning if localStorage fails
      }
    }
    return false; // Default to showing warning if not in browser
  }

  /**
   * Writes the user's preference to localStorage.
   * @param skip True to skip the warning, false to show it.
   */
  private setSkipPreference(skip: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.localStorageKey, String(skip));
        console.log(`ExternalLinkService: Skip preference saved: ${skip}`);
      } catch (e) {
        console.error('ExternalLinkService: Error writing to localStorage', e);
      }
    }
  }

  /**
   * Performs the actual navigation in a new tab.
   * @param url The URL to navigate to.
   */
  private _navigate(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Open the URL in a new tab/window
        window.open(url, '_blank', 'noopener noreferrer');
      } catch (e) {
        console.error(`ExternalLinkService: Error opening URL ${url}`, e);
      }
    }
  }
}
