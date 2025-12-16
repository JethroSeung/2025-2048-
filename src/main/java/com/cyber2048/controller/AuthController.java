package com.cyber2048.controller;

import com.cyber2048.dto.LoginRequest;
import com.cyber2048.dto.LoginResponse;
import com.cyber2048.dto.RegisterRequest;
import com.cyber2048.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return "ok";
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return new LoginResponse(token, request.getUsername());
    }
}
