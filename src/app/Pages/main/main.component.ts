// src/app/Pages/main/main.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// <<< Restore these imports so Angular can render your header/footer >>>
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('typing', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('sentenceReloader', { static: true })
  sentenceReloader!: ElementRef<HTMLElement>;

  displayedSentence = '';
  private typingTimeouts: number[] = [];
  private sentences: string[] = [
    "Intelligence is acknowledging knowing nothing. - Kiri",
        "Reality is just a crutch for people who can't handle science fiction. - Skylar Astin",
    "Procrastination is the art of keeping up with yesterday. - Don Marquis",
    "I’m not arguing, I’m just explaining why I’m right. - Charlie Bright",
    "Always borrow money from a pessimist, they never expect it back. - Oscar Wilde",
    "I don’t have a dirty mind, I have a sexy imagination. - Noah Sparks",
    "The early bird might get the worm, but the second mouse gets the cheese. - Steven Wright",
    "I’m not weird, I’m a limited edition. - Sam Cawthorn",
    "Success is just failure with better marketing. - Superinaligence",
    "If I had a dollar for every time I didn’t care, I’d be too rich to deal with this nonsense. - Weathly",
    "Life's a game, and I forgot the rules five minutes in. - Captain No-Idea",
    "Turns out, screaming into the void is actually quite therapeutic. - Doctor Yikes",
    "If procrastination were an Olympic sport, I’d still be late to the ceremony. - Queen of Delays",
    "Sometimes you just have to smile and pretend the world isn’t on fire. - Sir Chill-a-Lot",
    "I didn’t sign up for this, but here we are, thriving in chaos. - Awkward Overlord",
    "I’m not lazy; I’m on energy-saving mode for efficiency reasons. - Duke of Deflection",
    "Apparently, adulting is just a never-ending to-do list with no fun DLCs. - Miss Nope",
    "In the grand scheme of things, my plan is to wing it, survive, and maybe grab a snack. - Baroness Snackworthy",
    "Reality is just an illusion, but your failures? Oh, those are very real. - Bill Cipher"
  ];
  private workingSentences: string[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.workingSentences = [...this.sentences];
      this.displayRandomSentence();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clearTypingAnimation();
      console.log('MainComponent destroyed, typing timeouts cleared.');
    }
  }

  /** Called by (click) */
  onReload(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toggleAnimation();
    this.displayRandomSentence();
  }

  /** Spin 360° then clear the class */
  private toggleAnimation(): void {
    const el = this.sentenceReloader.nativeElement;
    el.classList.add('rotate360');
    setTimeout(() => el.classList.remove('rotate360'), 1000);
  }

  /** Clear old timeouts, then type a new sentence */
  private async displayRandomSentence(): Promise<void> {
    this.clearTypingAnimation();
    const sentence = this.getRandomSentence();
    await this.startTypingAnimation(sentence, 60);
  }

  /** Draw from the pool, reset if empty */
  private getRandomSentence(): string {
    if (!this.workingSentences.length) {
      this.workingSentences = [...this.sentences];
    }
    const i = Math.floor(Math.random() * this.workingSentences.length);
    return this.workingSentences.splice(i, 1)[0];
  }

  /** Type each character in turn */
  private startTypingAnimation(
    sentence: string,
    speed: number
  ): Promise<void> {
    this.displayedSentence = '';
    let idx = 0;
    return new Promise<void>(resolve => {
      const typeNext = () => {
        if (idx < sentence.length) {
          this.displayedSentence += sentence[idx++];
          this.typingTimeouts.push(window.setTimeout(typeNext, speed));
        } else {
          resolve();
        }
      };
      typeNext();
    });
  }

  /** Cancel any pending timeouts */
  private clearTypingAnimation(): void {
    this.typingTimeouts.forEach(id => clearTimeout(id));
    this.typingTimeouts = [];
  }
}
