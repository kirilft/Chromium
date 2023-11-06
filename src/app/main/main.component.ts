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
    "Imagination is more important than knowledge. - Albert Einstein",
    "Nothing in life is to be feared, it is only to be understood. - Marie Curie",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "That brain of mine is something more than merely mortal; as time will show. - Ada Lovelace",
    "Learning never exhausts the mind. - Leonardo da Vinci",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "If I have seen further it is by standing on the shoulders of giants. - Isaac Newton",
    "Science and everyday life cannot and should not be separated. - Rosalind Franklin",
    "Intelligence is the ability to adapt to change. - Stephen Hawking",
    "Pants are for losers. - Zoe McFife",
    "Be gay do crimes. - Alexander Hamilton"
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