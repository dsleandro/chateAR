package com.dsleandro.chatear.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import com.dsleandro.chatear.entity.ChatRoom;
import com.dsleandro.chatear.repository.ChatRoomRepository;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatId(String senderId, String recipientId, boolean createIfNotExist) {

        return chatRoomRepository.findByUsersId(senderId, recipientId).map(ChatRoom::getChatId)
        .or(() -> {
            if (!createIfNotExist) {
                return Optional.empty();
            }

            ChatRoom chatRoom = ChatRoom.builder().user1(senderId).user2(recipientId).build();

            String chatId = chatRoomRepository.save(chatRoom).getChatId();

            return Optional.of(chatId);
        });
    }
}
