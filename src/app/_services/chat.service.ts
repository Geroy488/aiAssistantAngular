import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    'gemini-2.5-flash-preview-09-2025:generateContent';

  private systemInstruction =
    'You are a helpful and knowledgeable instructor. ' +
    'Provide clear, concise, and structured answers. Use markdown formatting extensively.';

  constructor(private http: HttpClient) {}

  sendMessage(history: any[]): Observable<any> {
    const payload = {
      contents: history,
    //   tools: [{ google_search: {} }],
      systemInstruction: {
        parts: [{ text: this.systemInstruction }]
      }
    };

    return this.http.post(
      `${this.apiUrl}?key=${environment.geminiApiKey}`,
      payload
    );
  }
}
