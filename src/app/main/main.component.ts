import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

const ANIMATION_SPEED = 100;  // in milliseconds
const TYPING_SPEED = 100;  // in milliseconds
const BLINK_DELAY = 3500;  // in milliseconds

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
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
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild('tooltip') tooltip!: ElementRef;
  showIcons: boolean = false;
  
  displayedSentence: string = '';
  typingState: string = 'initial';
  blinkCaretState: string = 'initial';

  sentences: string[] = [
    "Pants are for losers. - Zoe McFife",
    "Be gay do crimes. - Alexander Hamilton",
    "Reality is just a crutch for people who can't handle science fiction. - Skylar Astin",
    "Procrastination is the art of keeping up with yesterday. - Don Marquis",
    "I’m not arguing, I’m just explaining why I’m right. - Charlie Bright",
    "Always borrow money from a pessimist, they never expect it back. - Oscar Wilde",
    "I don’t have a dirty mind, I have a sexy imagination. - Noah Sparks",
    "Why do they call it rush hour when nothing moves? - Robin Williams",
    "I'm not lazy, I'm on energy-saving mode. - Leah Clarkson",
    "The early bird might get the worm, but the second mouse gets the cheese. - Steven Wright",
    "Life is short. Smile while you still have teeth. - Mallory Hopkins",
    "I’m not weird, I’m a limited edition. - Sam Cawthorn"
  ];
  
  
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
}