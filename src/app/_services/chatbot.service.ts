import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

const baseUrl = `${environment.apiUrl}/chatbot`;

interface ChatResponse {
    conversationId: string;
    message: string;
    timestamp: string;
}

interface ChatMessage {
    chatMessageId: number;
    AccountId: number;
    conversationId: string;
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
    constructor(private http: HttpClient) { }

    sendMessage(message: string, conversationId?: string): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(`${baseUrl}/message`, { 
            message, 
            conversationId 
        });
    }

    getChatHistory(limit: number = 50): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`${baseUrl}/history?limit=${limit}`);
    }

    clearHistory(): Observable<any> {
        return this.http.delete(`${baseUrl}/history`);
    }
}