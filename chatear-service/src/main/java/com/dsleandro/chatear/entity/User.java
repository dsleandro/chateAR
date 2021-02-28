package com.dsleandro.chatear.entity;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.validation.constraints.Pattern.Flag;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class User {
    
	@Id
    @Null
    private String id;

    @NotBlank
    @Size(min = 2, max = 30)
    @Pattern(regexp = "[a-zA-Z -']*")
    private String firstName;

    @Size(max = 40)
    @Pattern(regexp = "[a-zA-Z -']*")
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^(?!.*\\.$)(?!.*\\.\\.)(?!\\..*)[a-z0-9_.]{3,15}$", flags = Flag.MULTILINE)
    private String username;
    
    @NotBlank
    @Size(min = 8, max = 255)
    private String password;
}
