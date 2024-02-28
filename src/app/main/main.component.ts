import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

const ANIMATION_SPEED = 100;  // in milliseconds
const TYPING_SPEED = 100;  // in milliseconds

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
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
    "I’m not weird, I’m a limited edition. - Sam Cawthorn",
    "once upon a time, i didn't care. still don't 🙂 - Humsi",
    "19 dollar Fortnite card - Moth",
    "I'm a yarn ball of anxiety. - Zoe McFife",
    "life hard, 8008 soft - Kiri"
  ];

  ngOnInit(): void {
    this.displayRandomSentence().catch(error => {
      console.error('Error during sentence display:', error);
    });
  }

  async displayRandomSentence(): Promise<void> {
    const sentence = this.getRandomElement(this.sentences);
    this.typingState = 'start';
    await this.startTypingAnimation(sentence, TYPING_SPEED);
  }

  getRandomElement<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  async startTypingAnimation(sentence: string, speed: number): Promise<void> {
    this.displayedSentence = ''; // Ensure to clear the previous sentence before starting
    for (let i = 0; i < sentence.length; i++) {
      this.displayedSentence += sentence[i];
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
}
