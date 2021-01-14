package com.dsleandro.chatear.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.dsleandro.chatear.entity.ChatMessage;
import com.dsleandro.chatear.entity.MessageStatus;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

        long countBySenderIdAndRecipientIdAndStatus(String senderId, String recipientId, MessageStatus status);

        List<ChatMessage> findByChatId(String chatId);
}
