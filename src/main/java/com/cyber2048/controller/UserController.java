package com.cyber2048.controller;

import com.cyber2048.common.Result;
import com.cyber2048.dto.LoginRequest;
import com.cyber2048.dto.RegisterRequest;
import com.cyber2048.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PostMapping("/register")
    public Result<?> register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return Result.success();
    }
    @PostMapping("/login")
    public Result<?> login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return Result.success(token);
    }
}

