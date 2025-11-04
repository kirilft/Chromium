// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../../services/icon/icon.component';
import { GalleryDataService } from '../../services/gallery-data.service';
import { ExternalLinkDirective } from '../../directives/external-link.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    IconComponent,
    RouterLink,
    RouterLinkActive,
    ExternalLinkDirective
],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-8px)'
        }),
        animate('200ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-8px)'
        }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Initialize currentTheme directly from the service in the constructor
  currentTheme: 'light' | 'dark';
  isMenuOpen: boolean = false;
  // *** ADDED: Flag to track client-side initialization ***
  themeInitializedClientSide: boolean = false;
  private themeSubscription: Subscription | null = null;

  constructor(
    public themeService: ThemeService,
    private galleryDataService: GalleryDataService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    // Set the initial theme directly from the service
    this.currentTheme = this.themeService.currentTheme;
    console.log(`HeaderComponent initial theme set to: ${this.currentTheme}`);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // *** Set flag to true once we are definitely on the client ***
      this.themeInitializedClientSide = true;
      console.log(`HeaderComponent client side initialized.`);

      // Subscribe to subsequent theme changes
      this.themeSubscription = this.themeService.themeChanged.subscribe((theme) => {
        console.log(`HeaderComponent received theme change: ${theme}`);
        this.currentTheme = theme;
        // Manually trigger change detection because theme affects the template
        this.cdr.markForCheck();
      });

      // *** Trigger initial change detection check after setting the flag ***
      // This ensures the template updates based on themeInitializedClientSide becoming true.
      this.cdr.markForCheck();
    }
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
      console.log('Header: Mouse entered Gallery link, triggering prefetch/preload.');
      this.galleryDataService.triggerPrefetch();
    }
  }
}
