    // src/app/Pages/gallery/gallery.component.ts
    import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
    
    import { HttpClientModule } from '@angular/common/http';
    import { Subscription } from 'rxjs';
    import { HeaderComponent } from '../../components/header/header.component';
    import { FooterComponent } from '../../components/footer/footer.component';
    import { GalleryDataService, GalleryImage } from '../../services/gallery-data.service';
    import { ExternalLinkDirective } from '../../directives/external-link.directive'; // <-- IMPORT DIRECTIVE

    @Component({
      selector: 'app-gallery',
      standalone: true,
      // Add ExternalLinkDirective to imports
      imports: [
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
    ExternalLinkDirective
],
      templateUrl: './gallery.component.html',
      styleUrls: ['./gallery.component.css']
    })
export class GalleryComponent implements OnInit, OnDestroy {
  readonly baseImagePath = 'assets/gallery/';
  images: GalleryImage[] = [];
  previewImageFullPath: string | null = null;
  previewDownloadUrl: string | null = null;
  loadedFullImages: Set<string> = new Set(); // Track which images have been loaded at full size
  loadingFull: Set<string> = new Set(); // Track images currently loading at full size
  private imagesSubscription: Subscription | null = null;

  constructor(
    private galleryDataService: GalleryDataService,
    private cdr: ChangeDetectorRef
  ) {}      ngOnInit(): void {
        console.log('GalleryComponent: Initializing and getting gallery data from service.');
        this.imagesSubscription = this.galleryDataService.getGalleryData()
          .subscribe({
            next: (data) => {
              this.images = data;
              console.log('GalleryComponent: Received gallery data from service:', this.images);
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('GalleryComponent: Error getting gallery data from service:', error);
              this.images = [];
              this.cdr.detectChanges();
            }
          });
      }

      ngOnDestroy(): void {
        if (this.imagesSubscription) {
          this.imagesSubscription.unsubscribe();
        }
      }

      openPreview(image: GalleryImage): void {
        // Start loading full-size image
        this.loadFullImage(image);
        console.log('GalleryComponent: Opening preview for:', image.src, 'Download:', image.downloadUrl);
      }

      closePreview(): void {
        this.previewImageFullPath = null;
        this.previewDownloadUrl = null;
        console.log('GalleryComponent: Closing preview');
      }

      /**
       * Progressively loads the full-size image when user clicks.
       * First shows the SD preview, then loads HD, then full 4K.
       * @param image The image to load
       */
      private loadFullImage(image: GalleryImage): void {
        const imageKey = image.src;
        
        // If already loaded, just show it
        if (this.loadedFullImages.has(imageKey)) {
          this.previewImageFullPath = this.baseImagePath + image.src;
          this.previewDownloadUrl = image.downloadUrl;
          return;
        }

        // If already loading, don't load again
        if (this.loadingFull.has(imageKey)) {
          this.previewImageFullPath = (image.srcSet?.sd || this.baseImagePath + image.src);
          this.previewDownloadUrl = image.downloadUrl;
          return;
        }

        // Mark as loading
        this.loadingFull.add(imageKey);

        // First, show the SD preview immediately
        this.previewImageFullPath = image.srcSet?.sd || this.baseImagePath + image.src;
        this.previewDownloadUrl = image.downloadUrl;
        this.cdr.detectChanges();

        // Then load HD version in background
        if (image.srcSet?.hd) {
          const hdImg = new Image();
          hdImg.onload = () => {
            console.log(`GalleryComponent: HD version loaded for ${imageKey}`);
            this.previewImageFullPath = image.srcSet!.hd;
            this.cdr.detectChanges();

            // After HD is loaded, preload full 4K
            this.preloadFullImage(image.srcSet!.full, imageKey);
          };
          hdImg.onerror = () => {
            console.warn(`GalleryComponent: Failed to load HD version for ${imageKey}`);
            this.loadFullImage4K(image, imageKey);
          };
          hdImg.src = image.srcSet.hd;
        } else {
          this.loadFullImage4K(image, imageKey);
        }
      }

      /**
       * Preloads the full 4K image in the background
       */
      private preloadFullImage(fullUrl: string, imageKey: string): void {
        const fullImg = new Image();
        fullImg.onload = () => {
          console.log(`GalleryComponent: Full 4K version loaded for ${imageKey}`);
          this.loadedFullImages.add(imageKey);
          this.loadingFull.delete(imageKey);
          this.previewImageFullPath = fullUrl;
          this.cdr.detectChanges();
        };
        fullImg.onerror = () => {
          console.warn(`GalleryComponent: Failed to load full version for ${imageKey}`);
          this.loadedFullImages.add(imageKey);
          this.loadingFull.delete(imageKey);
        };
        fullImg.src = fullUrl;
      }

      /**
       * Direct load of 4K version when HD is not available
       */
      private loadFullImage4K(image: GalleryImage, imageKey: string): void {
        if (image.srcSet?.full) {
          const fullImg = new Image();
          fullImg.onload = () => {
            console.log(`GalleryComponent: Full 4K version loaded for ${imageKey}`);
            this.loadedFullImages.add(imageKey);
            this.loadingFull.delete(imageKey);
            this.previewImageFullPath = image.srcSet!.full;
            this.cdr.detectChanges();
          };
          fullImg.onerror = () => {
            console.warn(`GalleryComponent: Failed to load full version for ${imageKey}`);
            this.loadedFullImages.add(imageKey);
            this.loadingFull.delete(imageKey);
          };
          fullImg.src = image.srcSet.full;
        } else {
          this.loadedFullImages.add(imageKey);
          this.loadingFull.delete(imageKey);
        }
      }
    }
    