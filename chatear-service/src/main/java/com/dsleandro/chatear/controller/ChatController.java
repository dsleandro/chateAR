package com.dsleandro.chatear.controller;

import java.util.Optional;

import com.dsleandro.chatear.entity.ChatMessage;
import com.dsleandro.chatear.entity.ChatNotification;
import com.dsleandro.chatear.service.ChatMessageService;
import com.dsleandro.chatear.service.ChatRoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

        @Autowired
        private SimpMessagingTemplate messagingTemplate;
        @Autowired
        private ChatMessageService chatMessageService;
        @Autowired
        private ChatRoomService chatRoomService;

        @MessageMapping("/chat")
        public void processMessage(@Validated @Payload ChatMessage chatMessage) {
                var chatId = chatRoomService.getChatId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);

                chatMessage.setChatId(chatId.get());

                ChatMessage saved = chatMessageService.save(chatMessage);

                messagingTemplate.convertAndSendToUser(chatMessage.getRecipientId(), "/queue/messages",
                                new ChatNotification(saved.getId(), saved.getSenderId(), saved.getSenderUsername()));
        }

        @GetMapping("/messages/{senderId}/{recipientId}/count")
        public ResponseEntity<Long> countNewMessages(@PathVariable String senderId, @PathVariable String recipientId) {

                return ResponseEntity.ok(chatMessageService.countNewMessages(senderId, recipientId));
        }

        @GetMapping("/messages/{senderId}/{recipientId}")
        public ResponseEntity<?> findChatMessages(@PathVariable String senderId, @PathVariable String recipientId) {
                return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
        }

        @GetMapping("/messages/last/{senderId}/{recipientId}")
        public ResponseEntity<?> findLastMessage(@PathVariable String senderId, @PathVariable String recipientId) {

               Optional<String> chatId = chatRoomService.getChatId(senderId, recipientId, false);

                return ResponseEntity.ok(chatMessageService.findLastMessage(chatId.orElse("")));
        }

        @GetMapping("/messages/{id}")
        public ResponseEntity<?> findMessage(@PathVariable String id) {
                return ResponseEntity.ok(chatMessageService.findById(id));
        }
}
