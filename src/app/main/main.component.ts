import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('typing', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('100ms', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: '0' })),
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
  showIcons = false;
  
  displayedSentence = '';
  typingState: string = 'initial';
  blinkCaretState: string = 'initial';

  sentences: string[] = [
    "As your personal healthcare companion, Baymax can scan your vitals and monitor your health.",

    "Baymax is equipped to assist with minor injuries, applying bandages and antiseptics as necessary.",

    "Baymax's programming allows him to remind you when it's time to take your medication.",

    "Baymax can provide basic medical advice based on your symptoms.",

    "In times of emotional distress, Baymax is designed to provide comfort and care.",

    "Baymax is equipped to help you maintain a healthy lifestyle with diet and exercise tips.",

    "Baymax can assist with physical therapy exercises to help you recover from injuries.",

    "Baymax's capabilities include monitoring your sleep patterns and suggesting improvements for better rest.",

    "Baymax can facilitate communication with medical professionals, helping to explain symptoms and conditions.",

    "Baymax is designed to provide companionship and engage in simple interactive activities.",

    "As your personal healthcare provider, Baymax can alert you if he detects any serious health conditions.",

    "Baymax can provide useful first aid information in case of emergencies.",

    "Baymax is able to keep track of your medical history and appointments.",

    "Baymax's programming enables him to help manage chronic conditions by reminding you to take prescribed medications and follow recommended routines.",

    "Baymax is equipped to provide a calming presence and use guided imagery techniques to help with stress and anxiety."
  ];

  ngOnInit() {
    this.displayRandomSentence();
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

  displayRandomSentence() {
    const index = Math.floor(Math.random() * this.sentences.length);
    const sentence = this.sentences[index];
    this.typingState = 'start';
    this.startTypingAnimation(sentence, 50);
  }

  startTypingAnimation(sentence: string, speed: number) {
    let i = 0;
    const typing = setInterval(() => {
      if (i < sentence.length) {
        this.displayedSentence += sentence[i];
        i++;
      } else {
        clearInterval(typing);
        this.typingState = 'final';
        setTimeout(() => {
          this.blinkCaretState = this.blinkCaretState === 'initial' ? 'final' : 'initial';
        }, 3500);
      }
    }, speed);
  }
}