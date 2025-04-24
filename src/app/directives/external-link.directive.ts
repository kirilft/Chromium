// src/app/directives/external-link.directive.ts
import { Directive, HostListener, ElementRef, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ExternalLinkService } from '../services/external-link.service';

@Directive({
  selector: 'a[appExternalLink]', // Apply directive to <a> tags with the appExternalLink attribute
  standalone: true // Make the directive standalone
})
export class ExternalLinkDirective {

  // Allow optionally disabling the directive check per link if needed
  @Input() appExternalLink: boolean | string = true;

  constructor(
    private el: ElementRef<HTMLAnchorElement>, // Reference to the host <a> element
    private externalLinkService: ExternalLinkService, // Inject the service
    @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    // Only run the logic in the browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check if the directive is explicitly disabled for this link
    if (this.appExternalLink === false || this.appExternalLink === 'false') {
        console.log('ExternalLinkDirective: Check skipped (directive disabled).');
        return; // Allow default behavior
    }

    const link = this.el.nativeElement;
    const url = link.href; // Get the fully resolved URL

    // Basic check for valid URL structure
    if (!url) {
      console.warn('ExternalLinkDirective: Anchor tag has no href attribute.');
      event.preventDefault(); // Prevent potential issues with empty href
      return;
    }

    // Check if it's a mailto link - allow default behavior
    if (url.startsWith('mailto:')) {
      console.log('ExternalLinkDirective: Mailto link detected, allowing default behavior.');
      return; // Allow default browser action
    }

    // Check if it's a javascript link - prevent execution for security
    if (url.startsWith('javascript:')) {
        console.warn('ExternalLinkDirective: Javascript link detected, blocking execution.');
        event.preventDefault();
        return;
    }

    // Check if the link points to the same origin (internal navigation)
    // Compare the link's origin with the window's current origin
    // Use 'link.origin' which handles ports correctly
    if (link.origin === window.location.origin) {
      // It's an internal link (likely handled by Angular Router or a fragment)
      // Or it could be a link to the same page with '#'
      console.log('ExternalLinkDirective: Internal link detected, allowing default behavior/Router.', url);
      return; // Allow default behavior (let Angular Router handle it or scroll to fragment)
    }

    // If we reach here, it's likely an external link
    console.log('ExternalLinkDirective: External link detected:', url);

    // Prevent the browser's default navigation for this external link
    event.preventDefault();

    // Call the service to handle the check and potential warning
    this.externalLinkService.checkAndProceed(url);
  }
}
