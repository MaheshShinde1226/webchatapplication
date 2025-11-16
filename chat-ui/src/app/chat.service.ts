import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ChatService {
    private baseUrl = 'http://localhost:8899/ai/generateStream';


    streamResponse(prompt: string): Observable<string> {
        return new Observable(sub => {
            const es = new EventSource(`${this.baseUrl}?prompt=${encodeURIComponent(prompt)}`);


            es.onmessage = (e) => {
                try {
                    const json = JSON.parse(e.data);
                    const text = json?.result?.output?.text ?? '';
                    if (text) sub.next(text);
                } catch {
                    // fallback if backend sends plain text sometimes
                    sub.next(e.data);
                }
            };



            es.onerror = () => {
                es.close();
                sub.complete();
            };


            return () => es.close();
        });
    }
}