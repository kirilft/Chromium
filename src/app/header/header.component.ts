import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('tooltip') tooltip!: ElementRef;
  showIcons = false;

  ngOnInit(): void {
      
  }

  ngAfterViewInit() {
    this.adjustDropdownPosition();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustDropdownPosition();
  }

  adjustDropdownPosition() {
    const rect = this.tooltip.nativeElement.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this.tooltip.nativeElement.style.right = '0';
      this.tooltip.nativeElement.style.left = 'auto';
      this.tooltip.nativeElement.style.transform = 'translateX(0)';
    } else {
      this.tooltip.nativeElement.style.right = 'auto';
      this.tooltip.nativeElement.style.left = '50%';
      this.tooltip.nativeElement.style.transform = 'translateX(-50%)';
    }
  }
}