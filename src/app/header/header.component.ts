// src/app/header/header.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  currentTheme: 'light' | 'dark' = 'light';

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.themeService.themeChanged.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
