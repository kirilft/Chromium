    // src/app/Pages/gallery/gallery.component.ts
    import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
    import { CommonModule } from '@angular/common';
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
          CommonModule,
          HeaderComponent,
          FooterComponent,
          HttpClientModule,
          ExternalLinkDirective // <-- ADD HERE
      ],
      templateUrl: './gallery.component.html',
      styleUrls: ['./gallery.component.css']
    })
    export class GalleryComponent implements OnInit, OnDestroy {
      readonly baseImagePath = 'assets/gallery/';
      images: GalleryImage[] = [];
      previewImageFullPath: string | null = null;
      previewDownloadUrl: string | null = null;
      private imagesSubscription: Subscription | null = null;

      constructor(
        private galleryDataService: GalleryDataService,
        private cdr: ChangeDetectorRef
      ) {}

      ngOnInit(): void {
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
        this.previewImageFullPath = this.baseImagePath + image.src;
        this.previewDownloadUrl = image.downloadUrl;
        console.log('GalleryComponent: Opening preview for:', this.previewImageFullPath, 'Download:', image.downloadUrl);
      }

      closePreview(): void {
        this.previewImageFullPath = null;
        this.previewDownloadUrl = null;
        console.log('GalleryComponent: Closing preview');
      }
    }
    