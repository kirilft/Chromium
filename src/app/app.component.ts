// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core'; // Removed Inject, added inject
import { Router, ActivatedRoute, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, CommonModule } from '@angular/common'; // Keep DOCUMENT import
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { ExternalLinkWarningComponent } from './components/external-link-warning/external-link-warning.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ExternalLinkWarningComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Inject services using inject() function
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  // Inject DOCUMENT using inject() function as well
  private document = inject(DOCUMENT);

  // Default description if route data is missing
  private defaultDescription = 'Kasai Tech - Kiri\'s experimental platform for web development, design, and photography.';

  // Constructor is no longer needed for dependency injection here
  // constructor() {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd),
        map((event: NavigationEnd) => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          const routeData = route.snapshot.data;
          const pageTitle = routeData['title'] || 'Kasai Tech';
          const pageDescription = routeData['description'] || this.defaultDescription;
          const currentUrl = event.urlAfterRedirects || event.url;
          // Use the injected document instance
          const canonicalUrl = this.document.location.origin + currentUrl;

          return { pageTitle, pageDescription, canonicalUrl };
        }),
        distinctUntilChanged((prev, curr) =>
            prev.pageTitle === curr.pageTitle &&
            prev.pageDescription === curr.pageDescription &&
            prev.canonicalUrl === curr.canonicalUrl
        )
      )
      .subscribe(({ pageTitle, pageDescription, canonicalUrl }) => {
        this.titleService.setTitle(pageTitle);
        console.log('AppComponent: Set Title to:', pageTitle);

        this.metaService.updateTag({ name: 'description', content: pageDescription });
        console.log('AppComponent: Set Description to:', pageDescription);

        this.updateCanonicalLink(canonicalUrl);
      });
  }

  private updateCanonicalLink(canonicalUrl: string): void {
    // Use the injected document instance
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', canonicalUrl);
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      this.document.head.appendChild(link);
      console.log('AppComponent: Created canonical URL:', canonicalUrl);
    }
  }
}
