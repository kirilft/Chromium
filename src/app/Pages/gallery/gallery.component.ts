// gallery.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed HttpClientModule as provideHttpClient() is preferred in app.config
import { HttpClient, HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';


@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    // Add HeaderComponent and FooterComponent here
    HeaderComponent,
    FooterComponent
  ],
  // Consider adding provideHttpClient(withFetch()) here if not provided globally in app.config.ts
  // providers: [provideHttpClient(withFetch())], // Example if needed locally
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  // Inject HttpClient using inject function
  private http = inject(HttpClient);

  // Component state
  images: string[] = [];
  previewImage: string | null = null;

  // Configuration for image loading
  private readonly manifestUrl = 'assets/gallery/images.json'; // Path to your image list
  private readonly basePath    = 'assets/gallery/'; // Base path for image files

  ngOnInit(): void {
    this.loadImages();
  }

  /**
   * Loads the list of image filenames from the manifest JSON file.
   */
  private loadImages(): void {
    this.http.get<string[]>(this.manifestUrl).pipe(
      catchError((err: HttpErrorResponse) => {
        // Log an error if the manifest can't be loaded
        console.error('Error loading gallery manifest:', err.message);
        // Return an empty array to prevent breaking the page
        return of([]);
      })
    ).subscribe(list => {
      // Map filenames to full paths and handle potential empty list
      this.images = (list && list.length)
        ? list.map(name => `${this.basePath}${name}`) // Removed slice(0, 9) to show all images
        : [];
      if (!this.images.length) {
        console.warn('No images found or listed in the gallery manifest.');
      }
    });
  }

  /**
   * Sets the image URL for the fullscreen preview.
   * @param img The URL of the image to preview.
   */
  openPreview(img: string): void {
    this.previewImage = img;
    // Optional: Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';
  }

  /**
   * Clears the preview image URL, hiding the overlay.
   */
  closePreview(): void {
    this.previewImage = null;
    // Optional: Restore body scroll
    document.body.style.overflow = '';
  }
}
