// src/app/app.component.ts
import { Component, OnInit, Inject } from '@angular/core'; // Import Inject
import { Router, ActivatedRoute, NavigationEnd, Event as RouterEvent } from '@angular/router'; // Import RouterEvent
import { Title } from '@angular/platform-browser'; // Title comes from platform-browser
import { DOCUMENT } from '@angular/common'; // Import DOCUMENT from @angular/common
import { filter, map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { ExternalLinkWarningComponent } from './components/external-link-warning/external-link-warning.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExternalLinkWarningComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document // Inject DOCUMENT
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        // Filter for NavigationEnd events only
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd),
        map((event: NavigationEnd) => {
          let route = this.activatedRoute;
          // Traverse to the deepest child route
          while (route.firstChild) {
            route = route.firstChild;
          }
          // Get title from route data or use default
          const pageTitle = route.snapshot.data['title'] || 'Kasai - To the Future and Beyond!';
          // Get the full URL for the canonical link
          const currentUrl = event.urlAfterRedirects || event.url; // Use urlAfterRedirects for accuracy
          // Construct the full canonical URL (assuming standard domain structure)
          const canonicalUrl = this.document.location.origin + currentUrl;

          return { pageTitle, canonicalUrl };
        })
      )
      .subscribe(({ pageTitle, canonicalUrl }) => {
        // 1. Update Page Title
        this.titleService.setTitle(pageTitle);

        // 2. Update Canonical Link
        let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

        if (link) {
          // Update existing canonical link
          link.setAttribute('href', canonicalUrl);
          console.log('Updated canonical URL to:', canonicalUrl);
        } else {
          // Create canonical link if it doesn't exist
          link = this.document.createElement('link');
          link.setAttribute('rel', 'canonical');
          link.setAttribute('href', canonicalUrl);
          this.document.head.appendChild(link);
          console.log('Created canonical URL:', canonicalUrl);
        }
      });
  }
}
