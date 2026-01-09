import { Component, OnInit } from '@angular/core';
import { ChatService } from '../_services/chat.service';

@Component({ 
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less'] // Use .less as per your project config
})
export class ChatComponent implements OnInit {
    chatHistory: any[] = [];
    userInput: string = '';
    isLoading: boolean = false;

    constructor(private chatService: ChatService) {}

    ngOnInit(): void {
    this.chatHistory.push({
        role: 'model',
        parts: [{
        text: 'Hello! I am ready to assist you. Ask a complex question to see me use my grounding ability.'
        }]
    });
    }


send() {
  if (!this.userInput.trim()) return;

  this.chatHistory.push({
    role: 'user',
    parts: [{ text: this.userInput }]
  });

  this.userInput = '';
  this.isLoading = true;

  this.chatService.sendMessage(this.chatHistory).subscribe({
    next: (response) => {
      const aiText =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response.';

      this.chatHistory.push({
        role: 'model',
        parts: [{ text: aiText }]
      });

      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}
}