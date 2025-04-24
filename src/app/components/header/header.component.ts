    // src/app/components/header/header.component.ts
    import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
    import { CommonModule, isPlatformBrowser } from '@angular/common';
    import { RouterLink, RouterLinkActive } from '@angular/router';
    import { Subscription } from 'rxjs';
    import { ThemeService } from '../../services/theme.service';
    import { IconComponent } from '../../services/icon/icon.component';
    import { GalleryDataService } from '../../services/gallery-data.service';
    import { ExternalLinkDirective } from '../../directives/external-link.directive'; // <-- IMPORT DIRECTIVE

    @Component({
      selector: 'app-header',
      standalone: true,
      // Add ExternalLinkDirective to imports
      imports: [
          CommonModule,
          IconComponent,
          RouterLink,
          RouterLinkActive,
          ExternalLinkDirective // <-- ADD HERE
      ],
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class HeaderComponent implements OnInit, OnDestroy {
      currentTheme: 'light' | 'dark' = 'light';
      isMenuOpen: boolean = false;
      private themeSubscription: Subscription | null = null;

      constructor(
        public themeService: ThemeService,
        private galleryDataService: GalleryDataService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cdr: ChangeDetectorRef
      ) {}

      ngOnInit(): void {
        this.currentTheme = this.themeService.currentTheme;
        if (isPlatformBrowser(this.platformId)) {
          this.themeSubscription = this.themeService.themeChanged.subscribe((theme) => {
            this.currentTheme = theme;
            this.cdr.markForCheck();
          });
        }
        this.cdr.markForCheck();
      }

      ngOnDestroy(): void {
        if (this.themeSubscription) {
          this.themeSubscription.unsubscribe();
        }
      }

      toggleTheme(): void {
        this.themeService.toggleTheme();
      }

      toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
        this.cdr.markForCheck();
      }

      closeMenu(): void {
        if (this.isMenuOpen) {
          this.isMenuOpen = false;
          this.cdr.markForCheck();
        }
      }

      prefetchGalleryData(): void {
        if (isPlatformBrowser(this.platformId)) {
          console.log('Header: Mouse entered Gallery link, triggering prefetch.');
          this.galleryDataService.triggerPrefetch();
        }
      }

      get isDarkTheme(): boolean {
        return this.currentTheme === 'dark';
      }
    }
    