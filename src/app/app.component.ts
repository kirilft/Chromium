// src/app/app.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DOCUMENT, CommonModule } from '@angular/common'; // Import CommonModule
import { filter, map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { ExternalLinkWarningComponent } from './components/external-link-warning/external-link-warning.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component'; // Import CookieConsentComponent

@Component({
  selector: 'app-root',
  standalone: true,
  // Add CookieConsentComponent to imports
  imports: [CommonModule, RouterOutlet, ExternalLinkWarningComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // ... (constructor remains the same) ...
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // ... (ngOnInit remains the same) ...
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd),
        map((event: NavigationEnd) => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          const pageTitle = route.snapshot.data['title'] || 'Kasai - To the Future and Beyond!';
          const currentUrl = event.urlAfterRedirects || event.url;
          const canonicalUrl = this.document.location.origin + currentUrl;
          return { pageTitle, canonicalUrl };
        })
      )
      .subscribe(({ pageTitle, canonicalUrl }) => {
        this.titleService.setTitle(pageTitle);
        let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
        if (link) {
          link.setAttribute('href', canonicalUrl);
          // console.log('Updated canonical URL to:', canonicalUrl); // Reduced console noise
        } else {
          link = this.document.createElement('link');
          link.setAttribute('rel', 'canonical');
          link.setAttribute('href', canonicalUrl);
          this.document.head.appendChild(link);
          // console.log('Created canonical URL:', canonicalUrl); // Reduced console noise
        }
      });
  }
}