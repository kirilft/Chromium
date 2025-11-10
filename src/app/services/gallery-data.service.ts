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
  srcSet?: {
    sd: string;  // Small/preview size (e.g., ~500px)
    hd: string;  // HD size (e.g., ~1200px)
    full: string; // Full 4K size
  };
}

@Injectable({
  providedIn: 'root' // Service available application-wide
})
export class GalleryDataService {
  readonly baseImagePath = 'assets/gallery/';
  private readonly jsonPath = `${this.baseImagePath}images.json`;

  // Observable to hold and replay the gallery image data
  private galleryData$: Observable<GalleryImage[]> | null = null;
  // Flag to prevent multiple preload attempts
  private preloadTriggered = false; // Renamed for clarity
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
   * Uses shareReplay(1) to cache the JSON response.
   * @returns Observable<GalleryImage[]>
   */
  getGalleryData(): Observable<GalleryImage[]> {
    if (!this.galleryData$) {
      console.log('GalleryDataService: Fetching gallery data for the first time.');
      this.galleryData$ = this.http.get<GalleryImage[]>(this.jsonPath).pipe(
        tap(data => {
          console.log('GalleryDataService: Gallery JSON loaded:', data);
          // Generate proxy URLs for each image if not already present
          data.forEach(image => {
            if (!image.srcSet) {
              image.srcSet = this.generateProxyUrls(image.src);
            }
          });
        }),
        shareReplay(1) // Cache the result and replay for subsequent subscribers
      );
    } else {
      console.log('GalleryDataService: Returning cached gallery data.');
    }
    return this.galleryData$;
  }

  /**
   * Generates proxy URLs for different image sizes.
   * The site generates these automatically based on width parameter.
   * @param filename The original image filename
   * @returns Object with sd, hd, and full quality URLs
   */
  private generateProxyUrls(filename: string) {
    // Assuming the proxy/CDN supports width parameter: ?w=<width>
    // Adjust the base URL if your CDN/proxy uses different parameters
    const basePath = `${this.baseImagePath}${filename}`;
    
    return {
      sd: `${basePath}?w=400`,   // Small device preview (~400px) - very small on phones
      hd: `${basePath}?w=1200`,  // HD size (~1200px)
      full: `${basePath}?w=3200` // Full 4K resolution (~3200px)
    };
  }

  /**
   * Initiates preloading of JSON and image resources when triggered (e.g., by hover).
   * Adds <link rel="preload"> tags to the document head for images.
   * 'preload' is used instead of 'prefetch' for higher priority, indicating
   * the resource is needed for the current or imminent navigation.
   * Only runs once per session and only in the browser.
   */
  triggerPrefetch(): void { // Method name kept for compatibility with HeaderComponent call
    // Only run preloading in the browser and only once
    if (!isPlatformBrowser(this.platformId) || this.preloadTriggered) {
      // console.log('GalleryDataService: Preload skipped (not browser or already triggered).');
      return;
    }

    console.log('GalleryDataService: Preload triggered by hover.');
    this.preloadTriggered = true; // Mark as triggered

    // 1. Ensure JSON data is fetched (or starts fetching)
    this.getGalleryData().pipe(
      take(1) // Ensure the subscription completes after getting data once
    ).subscribe(images => {
      // 2. Once JSON is loaded, add preload links for each image
      console.log(`GalleryDataService: Adding preload links for ${images.length} images.`);
      images.forEach(image => {
        this.addPreloadLink(this.baseImagePath + image.src); // Call the preload link method
      });
    });
  }

  /**
   * Dynamically adds a <link rel="preload"> tag to the document's <head>.
   * This hints the browser to fetch the resource with higher priority.
   * @param url The URL of the resource to preload.
   */
  private addPreloadLink(url: string): void { // Renamed method for clarity
    try {
      const link: HTMLLinkElement = this.renderer.createElement('link');
      // *** Use rel="preload" for higher priority fetching ***
      this.renderer.setAttribute(link, 'rel', 'preload');
      this.renderer.setAttribute(link, 'href', url);
      // Specify 'as' attribute for optimal prioritization
      this.renderer.setAttribute(link, 'as', 'image');
      // Append link to the head of the document
      this.renderer.appendChild(document.head, link);
      // console.log(`GalleryDataService: Added preload link for ${url}`);
    } catch (e) {
      console.error(`GalleryDataService: Error adding preload link for ${url}`, e);
    }
  }
}
