// src/app/Pages/gallery/gallery.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

// Define an interface for the structure of image data in the JSON
interface GalleryImage {
  src: string; // Now just the filename
  alt: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  // Base path for the gallery images
  readonly baseImagePath = 'assets/gallery/'; // Define base path

  // Array to hold the structured image data
  images: GalleryImage[] = [];
  // Property to store the *full path* of the image currently being previewed
  previewImageFullPath: string | null = null;
  // Property to store the download URL for the previewed image
  previewDownloadUrl: string | null = null;
  // Subscription to manage the HTTP request
  private imagesSubscription: Subscription | null = null;

  // Inject HttpClient and ChangeDetectorRef
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Fetch the image data from the JSON file
    this.imagesSubscription = this.http.get<GalleryImage[]>('assets/gallery/images.json')
      .subscribe({
        next: (data) => {
          this.images = data;
          console.log('Gallery images loaded (filenames only):', this.images);
          this.cdr.detectChanges(); // Trigger change detection if needed
        },
        error: (error) => {
          console.error('Error loading gallery images:', error);
          this.images = []; // Ensure images array is empty on error
          this.cdr.detectChanges(); // Trigger change detection
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the HTTP request to prevent memory leaks
    if (this.imagesSubscription) {
      this.imagesSubscription.unsubscribe();
    }
  }

  /**
   * Opens the preview overlay for the selected image.
   * Constructs the full path for the preview image.
   * @param image The GalleryImage object containing src (filename), alt, and downloadUrl.
   */
  openPreview(image: GalleryImage): void {
    // Construct the full path for the preview image
    this.previewImageFullPath = this.baseImagePath + image.src;
    this.previewDownloadUrl = image.downloadUrl; // Store the specific download URL
    console.log('Opening preview for:', this.previewImageFullPath, 'Download:', image.downloadUrl);
  }

  /**
   * Closes the preview overlay.
   */
  closePreview(): void {
    this.previewImageFullPath = null; // Clear the full path
    this.previewDownloadUrl = null; // Clear the download URL
    console.log('Closing preview');
  }
}
