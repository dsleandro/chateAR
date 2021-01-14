package com.dsleandro.chatear.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.dsleandro.chatear.entity.ChatRoom;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    //get chat room by Users IDs
    @Query("{$and: [{'$or': [{'user1': ?0},{'user1': ?1}]},{'$or': [{'user2': ?0},{'user2': ?1}]}]}")
    Optional<ChatRoom> findByUsersId(String user1, String user2);
}