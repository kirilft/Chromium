import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatHistory') private chatContainer!: ElementRef;
  
  messages = [
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ];
  inputMessage = '';

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.inputMessage.trim()) return;
  
    this.messages.push({ sender: 'user', text: this.inputMessage });
  
    // TODO: Send the user message to your chatbot backend and get a response
    // For now, just echo the user's message
    this.messages.push({ sender: 'bot', text: 'You said: ' + this.inputMessage });
  
    this.inputMessage = '';
  }
  

  scrollToBottom() {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }
}
