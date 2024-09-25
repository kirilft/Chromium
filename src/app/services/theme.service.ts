// src/app/services/theme.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private colorScheme: 'light' | 'dark';
  private debug: boolean = false; // Debug flag to control logging
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.themeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.colorScheme = this.detectColorScheme();
    this.applyTheme(this.colorScheme);
    this.themeSubject.next(this.colorScheme);

    if (this.debug) {
      console.log(`The Theme is set to ${this.colorScheme} mode`);
    }

    this.watchSystemThemeChanges();
  }

  /** Toggle debug mode */
  toggleDebugMode(debug: boolean) {
    this.debug = debug;
  }

  /** Detect the preferred color scheme */
  private detectColorScheme(): 'light' | 'dark' {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (storedTheme) {
        return storedTheme;
      } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      } else {
        return 'light';
      }
    } else {
      // Default to 'light' theme on the server
      return 'light';
    }
  }

  /** Watch for system theme changes */
  private watchSystemThemeChanges() {
    if (isPlatformBrowser(this.platformId)) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMediaQuery.addEventListener('change', (event) => {
        this.colorScheme = event.matches ? 'dark' : 'light';
        this.applyTheme(this.colorScheme);
        this.themeSubject.next(this.colorScheme);

        if (this.debug) {
          console.log(`System theme changed to ${this.colorScheme} mode`);
        }
      });
    }
  }

  /** Toggle between light and dark themes */
  toggleTheme() {
    this.colorScheme = this.colorScheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.colorScheme);
    this.themeSubject.next(this.colorScheme);

    if (this.debug) {
      console.log(`Theme changed to ${this.colorScheme} mode`);
    }
  }

  /** Apply the theme by updating the data-theme attribute */
  private applyTheme(theme: 'light' | 'dark') {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme); // Store the theme
    }
  }

  /** Get the current theme */
  get currentTheme() {
    return this.colorScheme;
  }
}
