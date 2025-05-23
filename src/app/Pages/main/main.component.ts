// src/app/Pages/main/main.component.ts
import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core'; // Import OnDestroy
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
export class MainComponent implements OnInit, AfterViewInit, OnDestroy { // Implement OnDestroy
  displayedSentence: string = '';
  typingState: string = 'initial';
  private typingTimeouts: any[] = [];
  sentences: string[] = [
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

  // Working copy of sentences for lazy shuffling.
  private workingSentences: string[] = [];

  @ViewChild('sentenceReloader', { static: true }) sentenceReloader!: ElementRef;

  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize the working copy with the original sentences.
      this.workingSentences = [...this.sentences];
      // *** REMOVE window.onload wrapper and call initialize directly ***
      this.initialize();
    }
  }

  ngAfterViewInit(): void {
    // Keep the click listener setup here
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen(this.sentenceReloader.nativeElement, 'click', () => {
        this.toggleAnimation();
        this.displayRandomSentence().then();
      });
    }
  }

  // *** ADD ngOnDestroy for cleanup ***
  ngOnDestroy(): void {
      if (isPlatformBrowser(this.platformId)) {
          this.clearTypingAnimation(); // Clear any running timeouts when component is destroyed
          console.log('MainComponent destroyed, typing animation cleared.');
      }
  }

  initialize(): void {
    console.log('MainComponent initializing animation...'); // Add log for debugging
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
    this.clearTypingAnimation(); // Ensure previous animation is stopped
    const sentence = this.getRandomSentence();
    this.typingState = 'start';
    await this.startTypingAnimation(sentence, 60);
  }

  // Lazy shuffle random function:
  // Picks a random sentence from a working copy that is reset when empty.
  private getRandomSentence(): string {
    if (this.workingSentences.length === 0) {
      console.log('Sentence list empty, resetting working copy.'); // Log for debugging
      this.workingSentences = [...this.sentences];
    }
    const randomIndex = Math.floor(Math.random() * this.workingSentences.length);
    const chosenSentence = this.workingSentences[randomIndex];
    // Swap with the last element and remove it for O(1) removal.
    this.workingSentences[randomIndex] = this.workingSentences[this.workingSentences.length - 1];
    this.workingSentences.pop();
    console.log('Selected sentence:', chosenSentence); // Log for debugging
    return chosenSentence;
  }

  async startTypingAnimation(sentence: string, speed: number): Promise<void> {
    this.displayedSentence = '';
    let index = 0;

    const typeCharacter = () => {
      // Check if component might have been destroyed mid-animation
      if (!this.typingTimeouts) return;

      if (index < sentence.length) {
        this.displayedSentence += sentence[index];
        index++;
        // Store timeout ID before setting it
        const timeoutId = setTimeout(typeCharacter, speed);
        this.typingTimeouts.push(timeoutId);
      } else {
         console.log('Typing animation complete.'); // Log for debugging
      }
    };

    // Start the recursive typing
    typeCharacter();
  }

  clearTypingAnimation(): void {
    console.log(`Clearing ${this.typingTimeouts.length} typing timeouts.`); // Log for debugging
    this.typingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.typingTimeouts = []; // Reset the array
    // Optionally reset displayed sentence if needed, though displayRandomSentence does this
    // this.displayedSentence = '';
    // this.typingState = '';
  }
}
