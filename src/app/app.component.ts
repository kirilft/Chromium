// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { ExternalLinkWarningComponent } from './components/external-link-warning/external-link-warning.component'; // Import the warning component

@Component({
  selector: 'app-root',
  standalone: true,
  // Add ExternalLinkWarningComponent to the imports array
  imports: [RouterOutlet, ExternalLinkWarningComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Ensure this file exists or remove if not needed
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Your existing logic for setting the page title based on routing
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          // Traverse to the deepest child route
          while (route.firstChild) {
            route = route.firstChild;
          }
          // Get title from route data or use default
          return route.snapshot.data['title'] || 'Kasai - To the Future and Beyond!';
        })
      )
      .subscribe((pageTitle: string) => {
        this.titleService.setTitle(pageTitle);
      });
  }
}
