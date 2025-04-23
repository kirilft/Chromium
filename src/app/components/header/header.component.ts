// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Import routing modules
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../../services/icon/icon.component';
import { GalleryDataService } from '../../services/gallery-data.service'; // Import GalleryDataService

@Component({
  selector: 'app-header',
  standalone: true,
  // Add RouterLink, RouterLinkActive
  imports: [CommonModule, IconComponent, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Use OnPush as specified
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Theme property based on user's code
  currentTheme: 'light' | 'dark' = 'light';
  // Menu state from previous version (needed for HTML)
  isMenuOpen: boolean = false;
  // Subscription for theme changes
  private themeSubscription: Subscription | null = null;

  constructor(
    public themeService: ThemeService, // Use public if template needs direct access
    private galleryDataService: GalleryDataService, // Inject GalleryDataService
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef for OnPush
  ) {}

  ngOnInit(): void {
    // Initialize theme based on service state
    this.currentTheme = this.themeService.currentTheme;

    // Subscribe to theme changes (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.themeSubscription = this.themeService.themeChanged.subscribe((theme) => {
        this.currentTheme = theme;
        this.cdr.markForCheck(); // Trigger change detection when theme changes
        // console.log('Header theme updated via subscription:', this.currentTheme);
      });
    }
     // Manually trigger check initially if needed, though currentTheme assignment might be enough
     this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  // Theme toggle method from user's code
  toggleTheme(): void {
    this.themeService.toggleTheme();
    // Note: The subscription in ngOnInit will handle updating currentTheme
  }

  // Menu toggle methods from previous version (needed for HTML)
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.markForCheck(); // Trigger change detection for menu state change
  }

  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.cdr.markForCheck(); // Trigger change detection if menu was closed
    }
  }

  // Method called when mouse enters the Gallery link
  prefetchGalleryData(): void {
    // Only prefetch in the browser
    if (isPlatformBrowser(this.platformId)) {
      console.log('Header: Mouse entered Gallery link, triggering prefetch.');
      this.galleryDataService.triggerPrefetch(); // Call the service method
    }
  }

  // Helper getter for the template binding [class.dark-theme]
  // This avoids needing direct access to themeService in the template if preferred
  // Alternatively, make themeService public and use `themeService.currentTheme === 'dark'` in template
  get isDarkTheme(): boolean {
    return this.currentTheme === 'dark';
  }
}
