import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChild('messagesRef', { static: false }) messagesRef!: ElementRef;


    prompt = '';
    messages: { from: 'user' | 'bot'; text: string; pending?: boolean }[] = [];
    loading = false;


    constructor(private chat: ChatService) { }


    send() {
        const text = this.prompt.trim();
        if (!text) return;


        this.messages.push({ from: 'user', text });
        const bot = { from: 'bot' as const, text: '', pending: true };
        this.messages.push(bot);


        this.loading = true;
        this.scrollToBottom();


        this.chat.streamResponse(text).subscribe({
            next: chunk => {
                bot.text += chunk;
                this.scrollToBottom();
            },
            error: () => {
                bot.text += "\n[Error receiving data]";
                bot.pending = false;
                this.loading = false;
            },
            complete: () => {
                bot.pending = false;
                this.loading = false;
                this.scrollToBottom();
            }
        });


        this.prompt = '';
    }


    scrollToBottom() {
        setTimeout(() => {
            try {
                const el = this.messagesRef.nativeElement as HTMLElement;
                el.scrollTop = el.scrollHeight;
            } catch { }
        }, 50);
    }
}