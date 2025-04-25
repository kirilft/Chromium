// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../../services/icon/icon.component';
import { GalleryDataService } from '../../services/gallery-data.service';
import { ExternalLinkDirective } from '../../directives/external-link.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
      CommonModule,
      IconComponent,
      RouterLink,
      RouterLinkActive,
      ExternalLinkDirective
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // Use OnPush for better performance, requires manual change detection triggers
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Initialize currentTheme directly from the service in the constructor
  currentTheme: 'light' | 'dark';
  isMenuOpen: boolean = false;
  private themeSubscription: Subscription | null = null;

  constructor(
    // Inject services
    public themeService: ThemeService, // Make public only if used directly in the template (it isn't here)
    private galleryDataService: GalleryDataService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef for manual change detection
  ) {
    // *** FIX: Set the initial theme directly from the service ***
    // This ensures the component starts with the correct theme value
    // provided by the ThemeService, reducing potential initial render mismatches.
    this.currentTheme = this.themeService.currentTheme;
    console.log(`HeaderComponent initial theme set to: ${this.currentTheme}`); // Debug log
  }

  ngOnInit(): void {
    // The initial theme is already set in the constructor.
    // Now, subscribe to subsequent theme changes.
    if (isPlatformBrowser(this.platformId)) {
      this.themeSubscription = this.themeService.themeChanged.subscribe((theme) => {
        console.log(`HeaderComponent received theme change: ${theme}`); // Debug log
        // Update the component's theme when the service emits a change
        this.currentTheme = theme;
        // *** Crucial for OnPush: Manually trigger change detection ***
        // This tells Angular to check this component and update its view
        // because the theme (which affects the *ngIf in the template) has changed.
        this.cdr.markForCheck();
      });
    }
    // An initial markForCheck in ngOnInit after constructor setup can sometimes
    // help ensure the view reflects the constructor-initialized state,
    // though often not strictly necessary if initialized correctly.
    // this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the theme service to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  /** Toggles the theme using the ThemeService. */
  toggleTheme(): void {
    this.themeService.toggleTheme();
    // Note: The theme change will be picked up by the subscription in ngOnInit,
    // which will update currentTheme and call markForCheck.
  }

  /** Toggles the mobile menu state. */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.markForCheck(); // Trigger change detection as menu state affects template
  }

  /** Closes the mobile menu if it's open. */
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.cdr.markForCheck(); // Trigger change detection
    }
  }

  /** Triggers preloading/prefeching of gallery data via the service. */
  prefetchGalleryData(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Header: Mouse entered Gallery link, triggering prefetch/preload.');
      this.galleryDataService.triggerPrefetch(); // Method name kept for compatibility
    }
  }

  // No longer need the isDarkTheme getter as currentTheme is used directly in the template's *ngIf
  // get isDarkTheme(): boolean {
  //   return this.currentTheme === 'dark';
  // }
}
