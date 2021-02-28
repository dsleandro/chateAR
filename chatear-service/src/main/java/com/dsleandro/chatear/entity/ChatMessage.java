package com.dsleandro.chatear.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatMessage {
   @Id
   @Null
   private String id;
   @NotBlank
   private String chatId;
   @NotBlank
   private String senderId;
   @NotBlank
   private String recipientId;
   @NotBlank
   private String senderUsername;
   @NotBlank
   private String recipientUsername;
   @NotBlank
   private String content;
   @NotNull
   private Date timestamp;
   @NotNull
   private MessageStatus status;
}