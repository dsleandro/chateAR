package com.dsleandro.chatear.controller;

import com.dsleandro.chatear.entity.User;
import com.dsleandro.chatear.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Validated User user, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        return ResponseEntity.ok(userService.saveNewUser(user));

    }

    @GetMapping(value = "/users/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getCurrentUser() {

        String loggedUser = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.getUser(loggedUser));

    }

    @GetMapping(value = "/users/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findAllUsers() {

        String loggedUser = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // returns all users except the logged User
        return ResponseEntity
                .ok(userService.getAll().stream().filter(user -> !user.getUsername().equals(loggedUser)).toArray());
    }

}
