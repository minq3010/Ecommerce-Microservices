package com.nnson128.userservice.controller;

import com.nnson128.userservice.dto.ApiResponse;
import com.nnson128.userservice.dto.request.LoginRequest;
import com.nnson128.userservice.dto.request.UserRegistrationRequest;
import com.nnson128.userservice.dto.response.UserResponse;
import com.nnson128.userservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok().body(ApiResponse.builder()
                .message("Successfully logged in")
                .success(true)
                .data(authService.login(request))
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Successfully logged in")
                .success(true)
                .data(response)
                .build());
    }
}
