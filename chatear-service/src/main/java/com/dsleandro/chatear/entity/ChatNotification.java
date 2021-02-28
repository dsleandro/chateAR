package com.dsleandro.chatear.entity;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {
    @NotBlank
    private String messageId;

    @NotBlank
    private String senderId;
    
    @NotBlank
    @Pattern(regexp = "^(?!.*\\.$)(?!.*\\.\\.)(?!\\..*)[a-z0-9_.]{3,15}$", flags = Flag.MULTILINE)
    private String senderUsername;
}
