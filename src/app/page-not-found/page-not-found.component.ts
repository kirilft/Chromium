// page-not-found.component.ts
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

const ANIMATION_SPEED = 50;  // in milliseconds
const TYPING_SPEED = 25;  // in milliseconds
const BLINK_DELAY = 3500;  // in milliseconds


@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
  animations: [
    trigger('typing', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate(`${ANIMATION_SPEED}ms`, style({ opacity: '1' })),
      ]),
      transition(':leave', [
        animate(`${ANIMATION_SPEED}ms`, style({ opacity: '0' })),
      ])
    ]),
    trigger('blink-caret', [
      transition('* => *', [
        animate('0.5s ease-in-out', style({ opacity: '0' })),
        animate('0.5s ease-in-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class PageNotFoundComponent {

  @ViewChild('tooltip') tooltip!: ElementRef;
  showIcons: boolean = false;
  
  displayedSentence: string = '';
  typingState: string = 'initial';
  blinkCaretState: string = 'initial';

  sentences: string[] = [
    "Oops! This page must have taken a wrong turn at the internet intersection.",
    "This page is playing hide and seek — and it's winning!",
    "404: Page not found. But on the bright side, we found this missing 'e' we've been looking for.",
    "The page you're looking for moved out. It left no forwarding address!",
    "Our website's hamster ran off with the page you're looking for.",
    "We asked the bytes, and none of them have seen your page.",
    "We would give you a map to the missing page, but we're out of ink.",
    "Error 404: Page evaporated. Try checking the clouds.",
    "Someone let the internet gremlins out, and they took this page. Try luring them back with coffee.",
    "This page must have been taken by aliens because we can't find it anywhere."
  ];
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.displayRandomSentence();
  }

  ngAfterViewInit(): void {
    this.adjustDropdownPosition();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.adjustDropdownPosition();
  }

  adjustDropdownPosition(): void {
    const { right } = this.tooltip.nativeElement.getBoundingClientRect();
    const { style } = this.tooltip.nativeElement;

    if (right > window.innerWidth) {
      Object.assign(style, { right: '0', left: 'auto', transform: 'translateX(0)' });
    } else {
      Object.assign(style, { right: 'auto', left: '50%', transform: 'translateX(-50%)' });
    }
  }

  displayRandomSentence(): void {
    const sentence = this.getRandomElement(this.sentences);
    this.typingState = 'start';
    this.startTypingAnimation(sentence, TYPING_SPEED);
  }

  getRandomElement<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  async startTypingAnimation(sentence: string, speed: number): Promise<void> {
    for (let i = 0; i < sentence.length; i++) {
      this.displayedSentence += sentence[i];
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    this.typingState = 'final';
    await new Promise(resolve => setTimeout(resolve, BLINK_DELAY));
    this.blinkCaretState = this.blinkCaretState === 'initial' ? 'final' : 'initial';
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }
}
