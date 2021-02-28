package com.dsleandro.chatear.service;

import com.dsleandro.chatear.repository.ChatMessageRepository;
import com.dsleandro.chatear.entity.ChatMessage;
import com.dsleandro.chatear.entity.MessageStatus;
import com.dsleandro.chatear.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository messageRepository;
    @Autowired
    private ChatRoomService chatRoomService;
    @Autowired
    private MongoOperations mongoOperations;

    public ChatMessage save(ChatMessage chatMessage) {
        chatMessage.setStatus(MessageStatus.RECEIVED);
        messageRepository.save(chatMessage);
        return chatMessage;
    }

    public long countNewMessages(String senderId, String recipientId) {
        return messageRepository.countBySenderIdAndRecipientIdAndStatus(senderId, recipientId, MessageStatus.RECEIVED);
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatRoomService.getChatId(senderId, recipientId, false);

        var messages = chatId.map(cId -> messageRepository.findByChatId(cId)).orElse(new ArrayList<>());

        if (messages.size() > 0) {
            updateStatuses(senderId, recipientId, MessageStatus.DELIVERED);
        }

        return messages;
    }

    public ChatMessage findById(String id) {
        return messageRepository.findById(id).map(chatMessage -> {
            chatMessage.setStatus(MessageStatus.DELIVERED);
            return messageRepository.save(chatMessage);
        }).orElseThrow(() -> new ResourceNotFoundException("can't find message (" + id + ")"));
    }

    public ChatMessage findLastMessage(String chatId) {
        return messageRepository.findFirst1ByChatIdOrderByTimestampDesc(chatId);
    }

    public void updateStatuses(String senderId, String recipientId, MessageStatus status) {
        Query query = new Query(Criteria.where("senderId").is(senderId).and("recipientId").is(recipientId));
        Update update = Update.update("status", status);

        mongoOperations.updateMulti(query, update, ChatMessage.class);
    }
}
