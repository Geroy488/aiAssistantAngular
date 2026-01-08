import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatbotService } from '@app/_services/chatbot.service';
import { AlertService } from '@app/_services';

interface ChatMessage {
    role: 'user' | 'assistant';
    message: string;
    timestamp: Date;
}

@Component({ 
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.less']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    
    form!: FormGroup;
    messages: ChatMessage[] = [];
    loading = false;
    conversationId?: string;
    isOpen = false;
    private shouldScroll = false;

    constructor(
        private formBuilder: FormBuilder,
        private chatbotService: ChatbotService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            message: ['', [Validators.required, Validators.maxLength(2000)]]
        });

        this.loadChatHistory();
    }

    ngAfterViewChecked() {
        if (this.shouldScroll) {
            this.scrollToBottom();
            this.shouldScroll = false;
        }
    }

    get f() { return this.form.controls; }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen && this.messages.length === 0) {
            this.addWelcomeMessage();
        }
    }

    loadChatHistory() {
        this.chatbotService.getChatHistory()
            .subscribe({
                next: (history) => {
                    this.messages = history.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
                    this.shouldScroll = true;
                },
                error: (error) => {
                    console.error('Error loading chat history:', error);
                }
            });
    }

    addWelcomeMessage() {
        this.messages.push({
            role: 'assistant',
            message: 'Hello! How can I assist you today?',
            timestamp: new Date()
        });
        this.shouldScroll = true;
    }

    sendMessage() {
        if (this.form.invalid) {
            return;
        }

        const userMessage = this.f.message.value.trim();
        if (!userMessage) {
            return;
        }

        // Add user message to display
        this.messages.push({
            role: 'user',
            message: userMessage,
            timestamp: new Date()
        });
        this.shouldScroll = true;

        // Clear input
        this.form.reset();
        this.loading = true;

        // Send to backend
        this.chatbotService.sendMessage(userMessage, this.conversationId)
            .subscribe({
                next: (response) => {
                    this.conversationId = response.conversationId;
                    this.messages.push({
                        role: 'assistant',
                        message: response.message,
                        timestamp: new Date(response.timestamp)
                    });
                    this.loading = false;
                    this.shouldScroll = true;
                },
                error: (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    clearHistory() {
        if (!confirm('Are you sure you want to clear the chat history?')) {
            return;
        }

        this.chatbotService.clearHistory()
            .subscribe({
                next: () => {
                    this.messages = [];
                    this.conversationId = undefined;
                    this.addWelcomeMessage();
                    this.alertService.success('Chat history cleared');
                },
                error: (error) => {
                    this.alertService.error(error);
                }
            });
    }

    private scrollToBottom() {
        try {
            this.messagesContainer.nativeElement.scrollTop = 
                this.messagesContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Scroll error:', err);
        }
    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
}