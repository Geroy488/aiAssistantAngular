import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../_services/chat.service';

@Component({ 
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer!: ElementRef; // Access the div

    chatHistory: any[] = [];
    userInput: string = '';
    isLoading: boolean = false;

    constructor(private chatService: ChatService) {}

    ngOnInit(): void {
        this.chatHistory.push({
            role: 'model',
            parts: [{ text: 'Hello! I am ready to assist you.' }]
        });
    }

    // This runs every time the view changes (new messages, loading states, etc.)
    ngAfterViewChecked() {        
        this.scrollToBottom();        
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

    send() {
        if (this.isLoading || !this.userInput.trim()) return;

        this.chatHistory.push({
            role: 'user',
            parts: [{ text: this.userInput }]
        });

        this.userInput = '';
        this.isLoading = true;

        this.chatService.sendMessage(this.chatHistory).subscribe({
            next: (response) => {
                const aiText = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
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