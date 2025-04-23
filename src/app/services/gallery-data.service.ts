// src/app/services/gallery-data.service.ts
import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, tap, shareReplay, take } from 'rxjs';

// Interface for gallery image data (matches images.json structure)
export interface GalleryImage {
  src: string; // Filename only
  alt: string;
  downloadUrl: string;
}

@Injectable({
  providedIn: 'root' // Service available application-wide
})
export class GalleryDataService {
  readonly baseImagePath = 'assets/gallery/';
  private readonly jsonPath = `${this.baseImagePath}images.json`;

  // Observable to hold and replay the gallery image data
  private galleryData$: Observable<GalleryImage[]> | null = null;
  // Flag to prevent multiple prefetch attempts
  private prefetchTriggered = false;
  // Renderer to interact with the DOM safely
  private renderer: Renderer2;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object, // Inject platform ID
    rendererFactory: RendererFactory2 // Inject renderer factory
  ) {
    // Create renderer instance (needed for DOM manipulation)
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Gets the gallery image data. Fetches if not already cached.
   * @returns Observable<GalleryImage[]>
   */
  getGalleryData(): Observable<GalleryImage[]> {
    if (!this.galleryData$) {
      console.log('GalleryDataService: Fetching gallery data for the first time.');
      this.galleryData$ = this.http.get<GalleryImage[]>(this.jsonPath).pipe(
        tap(data => console.log('GalleryDataService: Gallery JSON loaded:', data)),
        shareReplay(1) // Cache the result and replay for subsequent subscribers
      );
    } else {
      console.log('GalleryDataService: Returning cached gallery data.');
    }
    return this.galleryData$;
  }

  /**
   * Initiates prefetching of JSON and image resources.
   * Adds <link rel="prefetch"> tags to the document head for images.
   * Only runs once and only in the browser.
   */
  triggerPrefetch(): void {
    // Only run prefetching in the browser and only once
    if (!isPlatformBrowser(this.platformId) || this.prefetchTriggered) {
      // console.log('GalleryDataService: Prefetch skipped (not browser or already triggered).');
      return;
    }

    console.log('GalleryDataService: Prefetch triggered by hover.');
    this.prefetchTriggered = true; // Mark as triggered

    // 1. Ensure JSON data is fetched (or starts fetching)
    this.getGalleryData().pipe(
      take(1) // Ensure the subscription completes after getting data once
    ).subscribe(images => {
      // 2. Once JSON is loaded, add prefetch links for each image
      console.log(`GalleryDataService: Adding prefetch links for ${images.length} images.`);
      images.forEach(image => {
        this.addPrefetchLink(this.baseImagePath + image.src);
      });
    });
  }

  /**
   * Dynamically adds a <link rel="prefetch"> tag to the document's <head>.
   * @param url The URL of the resource to prefetch.
   */
  private addPrefetchLink(url: string): void {
    try {
      const link: HTMLLinkElement = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'prefetch');
      this.renderer.setAttribute(link, 'href', url);
      this.renderer.setAttribute(link, 'as', 'image'); // Hint the type of content
      // Append link to the head of the document
      this.renderer.appendChild(document.head, link);
      // console.log(`GalleryDataService: Added prefetch link for ${url}`);
    } catch (e) {
      console.error(`GalleryDataService: Error adding prefetch link for ${url}`, e);
    }
  }
}
