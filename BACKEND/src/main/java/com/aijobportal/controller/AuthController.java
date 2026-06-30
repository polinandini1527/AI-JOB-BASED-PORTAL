package com.aijobportal.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aijobportal.dto.RegisterRequest;
import com.aijobportal.dto.LoginRequest;
import com.aijobportal.model.User;
import com.aijobportal.service.AuthService;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==========================
    // REGISTER
    // ==========================
    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        User user = new User(0, request.getName(), request.getEmail(), request.getPassword(), request.getSkills());
        return authService.register(user);
    }

    // ==========================
    // LOGIN
    // ==========================
    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }
}