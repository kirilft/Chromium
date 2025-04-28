import { Injectable, Inject, PLATFORM_ID, EventEmitter, inject } from '@angular/core'; // Added inject
import { isPlatformBrowser } from '@angular/common';
import { ConsentService } from './consent.service'; // Import ConsentService

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private colorScheme: 'light' | 'dark';
  private debug: boolean = false;

  /** EventEmitter to broadcast theme changes */
  public themeChanged = new EventEmitter<'light' | 'dark'>();

  // Inject ConsentService
  private consentService = inject(ConsentService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.colorScheme = this.detectColorScheme();
    // Apply theme immediately (visually), but only save if consent allows later
    this.applyThemeUI(this.colorScheme);
    this.themeChanged.emit(this.colorScheme); // Emit initial theme

    if (this.debug) {
      console.log(`The Theme is set to ${this.colorScheme} mode`);
    }

    this.watchSystemThemeChanges();
  }

  /** Detect the preferred color scheme, checking localStorage ONLY if consent is given */
  private detectColorScheme(): 'light' | 'dark' {
    if (isPlatformBrowser(this.platformId)) {
      // Check consent BEFORE reading from localStorage
      if (this.consentService.hasConsent()) {
          try {
            const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
            if (storedTheme) {
              console.log('ThemeService: Theme loaded from localStorage (consent given).');
              return storedTheme;
            }
          } catch (e) {
            console.error('ThemeService: Error reading theme from localStorage', e);
          }
      } else {
          console.log('ThemeService: Skipping localStorage read for theme (no consent).');
      }

      // Fallback to system preference if no stored theme or no consent
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        console.log('ThemeService: Using system preference (dark).');
        return 'dark';
      }
    }
    // Default to 'light' theme on server or if system preference is light
    console.log('ThemeService: Using default theme (light).');
    return 'light';
  }

  /** Watch for system theme changes */
  private watchSystemThemeChanges() {
    if (isPlatformBrowser(this.platformId)) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMediaQuery.addEventListener('change', (event) => {
        // If the user hasn't manually set a theme (i.e., no consent or not saved yet)
        // follow the system theme change.
        // We might refine this logic: maybe only follow system if no manual toggle ever happened.
        // For now, let's assume system changes guide the theme unless manually overridden AND saved.

        // Re-detect might be simpler if consent is already given and something IS stored.
        // Let's just update based on event for now.
        const newSystemTheme = event.matches ? 'dark' : 'light';
        console.log(`ThemeService: System theme changed to ${newSystemTheme}.`);

        // Update the current theme state *if* we aren't overriding it with a saved preference.
        // Simplification: If no consent, always follow system. If consent, toggleTheme handles saving.
        // This needs careful thought: If user manually set light, should system changing to dark override?
        // Let's stick to: manual toggle overrides system until cleared/consent revoked.

        // Update UI based on system change, but don't save automatically
        this.colorScheme = newSystemTheme;
        this.applyThemeUI(this.colorScheme); // Apply visually
        this.themeChanged.emit(this.colorScheme); // Emit change

        // Optionally, if consent is given, check if the stored theme matches the NEW system theme.
        // If not, perhaps prompt the user? Too complex for now.
      });
    }
  }

  /** Toggle between light and dark themes */
  toggleTheme() {
    this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark';
    // Apply theme UI immediately, save preference only if consent allows
    this.applyTheme(this.colorScheme);
    this.themeChanged.emit(this.colorScheme); // Emit theme change

    if (this.debug) {
      console.log(`Theme changed to ${this.colorScheme} mode`);
    }
  }

  /** Apply the theme UI and save to localStorage IF consent is given */
  private applyTheme(theme: 'light' | 'dark') {
    this.applyThemeUI(theme); // Always update UI
    if (isPlatformBrowser(this.platformId)) {
        // Check consent BEFORE writing to localStorage
        if (this.consentService.hasConsent()) {
            try {
                localStorage.setItem('theme', theme); // Store the theme
                console.log(`ThemeService: Theme preference (${theme}) saved to localStorage (consent given).`);
            } catch (e) {
                console.error('ThemeService: Error writing theme to localStorage', e);
            }
        } else {
            console.log(`ThemeService: Skipping localStorage write for theme (${theme}) (no consent).`);
        }
    }
  }

  /** Apply theme only to the UI (data attribute) */
  private applyThemeUI(theme: 'light' | 'dark') {
      if (isPlatformBrowser(this.platformId)) {
          document.documentElement.setAttribute('data-theme', theme);
      }
  }

  /** Get the current theme */
  get currentTheme() {
    return this.colorScheme;
  }
}