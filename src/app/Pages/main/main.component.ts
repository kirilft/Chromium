import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 })),
      ])
    ])
  ],
})

export class MainComponent implements OnInit, AfterViewInit {
  displayedSentence: string = '';
  typingState: string = 'initial';
  private typingTimeouts: any[] = [];
  sentences: string[] = [
    "Intelligence is acknowledging that even a fox sometimes forgets its tail. - The Furry Sage",
    "In the cyber-forest, protogen spirit meets raw RAM power—unleash your inner beast. - Digital Lupine",
    "Reality is a playground for those bold enough to let their fur fly. - Astro Paws",
    "Procrastination is like a cat napping in a sunbeam—tempting yet delaying the chase. - Whiskered Wanderer",
    "I’m not arguing; I’m just pouncing on the right point with impeccable fox finesse. - Velvet Claws",
    "I’m not weird; I’m a one-of-a-kind fur edition. - Mystic Muzzle",
    "I’m not lazy; I’m conserving energy for my next epic midnight sprint across the digital savannah. - Nocturnal Nova",
    "Fur real: I'm a wild coder. - Cyber Fox",
    "Byte me, I run on RAM and dreams. - Protogen Pixie",
    "Fur-get limits, only pawsibilities. - Wily Whiskers",
    "Too pawsome for basic reality. - Neon Furr",
    "Keep calm and let the fur fly. - Pawsitive Vibes",
    "Chasing tails, breaking codes. - Whiskered Whiz"
  ];

  @ViewChild('sentenceReloader', { static: true }) sentenceReloader!: ElementRef;

  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Check if we are running in the browser (not server-side)
    if (isPlatformBrowser(this.platformId)) {
      window.onload = () => {
        this.initialize();
      };
    }
  }

  ngAfterViewInit(): void {
    // Only add event listeners if we're in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen(this.sentenceReloader.nativeElement, 'click', () => {
        this.toggleAnimation();
        this.displayRandomSentence().then();
      });
    }
  }

  initialize(): void {
    this.displayRandomSentence().catch(error => console.error('Error during sentence display:', error));
  }

  toggleAnimation(): void {
    const element = this.sentenceReloader.nativeElement;
    element.classList.add('rotate360');
    setTimeout(() => {
      element.classList.remove('rotate360');
    }, 1000);
  }

  async displayRandomSentence(): Promise<void> {
    this.clearTypingAnimation();
    const sentence = this.getRandomElement(this.sentences);
    this.typingState = 'start';
    await this.startTypingAnimation(sentence, 60);
  }

  getRandomElement<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  async startTypingAnimation(sentence: string, speed: number): Promise<void> {
    this.displayedSentence = '';
    let index = 0;

    const typeCharacter = () => {
      if (index < sentence.length) {
        this.displayedSentence += sentence[index];  // Append characters correctly
        index++;
        const timeoutId = setTimeout(typeCharacter, speed);
        this.typingTimeouts.push(timeoutId);
      }
    };

    typeCharacter();
  }

  clearTypingAnimation(): void {
    this.typingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.typingTimeouts = [];
    this.displayedSentence = '';
    this.typingState = '';
  }
}
