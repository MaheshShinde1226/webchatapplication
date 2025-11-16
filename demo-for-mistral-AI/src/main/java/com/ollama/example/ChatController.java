package com.ollama.example;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class ChatController {

    private final OllamaChatModel chatModel;

    public ChatController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/generateStream")
    public Flux<ChatResponse> prompt(@RequestParam(value = "prompt") String prompt) {
        Prompt prompt1 = new Prompt(new UserMessage(prompt));
        return this.chatModel.stream(prompt1);
    }
}
