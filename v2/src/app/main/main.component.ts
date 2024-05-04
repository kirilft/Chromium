import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { trigger, style, transition, animate } from '@angular/animations';

const ANIMATION_SPEED = 100;  // in milliseconds
const TYPING_SPEED = 100;  // in milliseconds

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  animations: [
    trigger('typing', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(`${ANIMATION_SPEED}ms`, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(`${ANIMATION_SPEED}ms`, style({ opacity: 0 })),
      ])
    ])
  ],
})

export class MainComponent implements OnInit {
  displayedSentence: string = '';
  typingState: string = 'initial';
  private typingTimeouts: any[] = [];
  sentences: string[] = [
    "Pants are for losers. - Zoe McFife",
    "I'm a yarn ball of anxiety. - Zoe McFife",
    "Be gay do crimes. - Alexander Hamilton",
    "once upon a time, i didn't care. still don't 🙂 - Humsi",
    "19 dollar Fortnite card - Moth",
    "Thinking about being stupid makes you smarter than most people. - Kiri",
    "Don't let yourself make excuses for not doing the things you want to do. - Sam Altman",
    "Move fast. Speed is one of your main advantages over large competitors. - Sam Altman",
    "Reality is just a crutch for people who can't handle science fiction. - Skylar Astin",
    "Procrastination is the art of keeping up with yesterday. - Don Marquis",
    "I’m not arguing, I’m just explaining why I’m right. - Charlie Bright",
    "Always borrow money from a pessimist, they never expect it back. - Oscar Wilde",
    "I don’t have a dirty mind, I have a sexy imagination. - Noah Sparks",
    "The early bird might get the worm, but the second mouse gets the cheese. - Steven Wright",
    "I’m not weird, I’m a limited edition. - Sam Cawthorn"
  ];

  ngOnInit(): void {
    this.displayRandomSentence().catch(error => console.error('Error during sentence display:', error));
  }

  async displayRandomSentence(): Promise<void> {
    this.clearTypingAnimation(); // Clear any ongoing typing animation before starting a new one
    const sentence = this.getRandomElement(this.sentences);
    this.typingState = 'start'; // Might need adjustment to re-trigger Angular animations
    await this.startTypingAnimation(sentence, TYPING_SPEED);
  }

  getRandomElement<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  async startTypingAnimation(sentence: string, speed: number): Promise<void> {
    this.displayedSentence = '';
    for (let i = 0; i < sentence.length; i++) {
      const timeoutId = setTimeout(() => {
        this.displayedSentence += sentence[i];
      }, i * speed);
      this.typingTimeouts.push(timeoutId);
    }
  }

  clearTypingAnimation(): void {
    this.typingTimeouts.forEach(timeoutId => clearTimeout(timeoutId)); // Clear all timeouts
    this.typingTimeouts = []; // Reset the timeouts array
    this.displayedSentence = ''; // Clear the currently displayed sentence
    this.typingState = ''; // Reset typing state, if needed for Angular animations
  }
}
