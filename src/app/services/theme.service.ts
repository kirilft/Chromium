import { Injectable, PLATFORM_ID, inject, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  // Inject dependencies
  private platformId = inject(PLATFORM_ID);
  private rendererFactory = inject(RendererFactory2);
  // Initialize renderer as potentially null for SSR safety
  private renderer: Renderer2 | null = null;

  // BehaviorSubject for theme state
  private themeSubject = new BehaviorSubject<Theme>('light');
  public theme$ = this.themeSubject.asObservable(); // Public observable

  // Subject for cleanup
  private destroy$ = new Subject<void>();

  // Store the listener function reference for removal
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;

  constructor() {
    // Create renderer only in browser
    if (isPlatformBrowser(this.platformId)) {
      // Assign to the class property
      this.renderer = this.rendererFactory.createRenderer(null, null);
      this.initializeTheme();
      this.watchSystemThemeChanges();
    } else {
      // Set initial theme for SSR (won't be applied to document)
      this.themeSubject.next('light');
    }
  }

  ngOnDestroy(): void {
    // Clean up listener and subscriptions
    if (isPlatformBrowser(this.platformId) && this.mediaQueryListener) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      // Ensure the correct listener reference is removed
      darkModeMediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Gets the current theme value */
  get currentTheme(): Theme {
    return this.themeSubject.getValue();
  }

  /** Initializes the theme based on storage or system preference (Browser Only) */
  private initializeTheme(): void {
    const initialTheme = this.getInitialTheme();
    this.themeSubject.next(initialTheme);
    this.applyTheme(initialTheme); // Apply the theme to the document
    console.log(`ThemeService: Initial theme set to ${initialTheme}`);
  }

  /** Determines the initial theme (Browser Only) */
  private getInitialTheme(): Theme {
    // Should only run in browser context where localStorage and matchMedia exist
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /** Watches for system theme changes (Browser Only) */
  private watchSystemThemeChanges(): void {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Define the listener function correctly
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      // Only update if no explicit theme is set in localStorage
      if (!localStorage.getItem('theme')) {
        const newColorScheme: Theme = event.matches ? 'dark' : 'light';
        this.themeSubject.next(newColorScheme);
        this.applyTheme(newColorScheme); // Apply theme directly
        console.log(`ThemeService: System theme changed to ${newColorScheme}. Applied.`);
      } else {
        console.log(`ThemeService: System theme changed, but user preference in localStorage overrides.`);
      }
    };

    // Add the defined listener
    darkModeMediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  /** Toggles between light and dark themes and saves preference */
  toggleTheme(): void {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme, true); // Set theme and store preference
  }

  /** Sets the theme explicitly */
  setTheme(theme: Theme, storePreference: boolean = false): void {
     if (!isPlatformBrowser(this.platformId)) {
       this.themeSubject.next(theme); // Update state for SSR if needed
       return;
     }
    this.themeSubject.next(theme);
    this.applyTheme(theme); // Apply theme to document

    if (storePreference) {
      localStorage.setItem('theme', theme);
      console.log(`ThemeService: Theme explicitly set to ${theme} and stored.`);
    } else {
       console.log(`ThemeService: Theme explicitly set to ${theme}.`);
    }
  }

  /** Resets the theme to system preference */
  resetToSystemTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
       return;
     }
    localStorage.removeItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.setTheme(systemTheme, false); // Set theme without storing
    console.log(`ThemeService: Theme reset to system preference (${systemTheme}).`);
  }

  /** Apply the theme by updating the data-theme attribute (Browser Only) */
  private applyTheme(theme: Theme): void {
     // Check for renderer existence (it's null on server)
     if (this.renderer) {
        this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
     }
  }
}
