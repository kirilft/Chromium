// src/app/Pages/gallery/gallery.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Keep HttpClientModule if other components need it directly
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { GalleryDataService, GalleryImage } from '../../services/gallery-data.service'; // Import service and interface

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, HttpClientModule], // HttpClientModule might still be needed if Footer/Header use HttpClient directly
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  // Base path for the gallery images (can get from service too if preferred)
  readonly baseImagePath = 'assets/gallery/';

  // Array to hold the structured image data
  images: GalleryImage[] = [];
  // Property to store the *full path* of the image currently being previewed
  previewImageFullPath: string | null = null;
  // Property to store the download URL for the previewed image
  previewDownloadUrl: string | null = null;
  // Subscription to manage the data request
  private imagesSubscription: Subscription | null = null;

  // Inject GalleryDataService and ChangeDetectorRef
  constructor(
    private galleryDataService: GalleryDataService, // Use the service
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('GalleryComponent: Initializing and getting gallery data from service.');
    // Get the image data from the service
    this.imagesSubscription = this.galleryDataService.getGalleryData()
      .subscribe({
        next: (data) => {
          this.images = data;
          console.log('GalleryComponent: Received gallery data from service:', this.images);
          this.cdr.detectChanges(); // Trigger change detection if needed
        },
        error: (error) => {
          console.error('GalleryComponent: Error getting gallery data from service:', error);
          this.images = []; // Ensure images array is empty on error
          this.cdr.detectChanges(); // Trigger change detection
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the data request to prevent memory leaks
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
    console.log('GalleryComponent: Opening preview for:', this.previewImageFullPath, 'Download:', image.downloadUrl);
  }

  /**
   * Closes the preview overlay.
   */
  closePreview(): void {
    this.previewImageFullPath = null; // Clear the full path
    this.previewDownloadUrl = null; // Clear the download URL
    console.log('GalleryComponent: Closing preview');
  }
}
