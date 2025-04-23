import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, inject, signal, WritableSignal, ChangeDetectorRef } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service'; // Import Theme type
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../services/icon/icon.component'; // Correctly exported now
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterLink } from '@angular/router'; // Import RouterLink

@Component({
  selector: 'app-header',
  standalone: true,
  // Add RouterLink for the navigation links
  imports: [CommonModule, IconComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Dependencies
  public themeService = inject(ThemeService);
  private cdRef = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  // State
  currentTheme: Theme = 'light';
  isMobileMenuOpen: WritableSignal<boolean> = signal(false); // Use signal for menu state

  // Cleanup
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Initialize theme
    this.currentTheme = this.themeService.currentTheme;

    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme: Theme) => {
        this.currentTheme = theme;
        this.cdRef.markForCheck(); // Trigger change detection for OnPush
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Toggles the theme using the ThemeService */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /** Toggles the mobile navigation menu open/closed */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
    console.log('Mobile menu toggled:', this.isMobileMenuOpen()); // For debugging
  }

  /** Closes the mobile menu (e.g., when a link is clicked) */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
