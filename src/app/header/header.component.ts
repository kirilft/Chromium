import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service'; // Adjust the path as needed
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // For *ngIf directive

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTheme: 'light' | 'dark' = 'light'; // Initialize with a default value
  private themeSubscription: Subscription = new Subscription();

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Get the initial theme
    this.currentTheme = this.themeService.currentTheme;

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.themeSubscription.unsubscribe();
  }

  /** Toggle the theme when the user clicks the switcher */
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
