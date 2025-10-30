package com.nnson128.userservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public String admin(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;
        return "Hello Admin, you are authenticated and authorized!: " + userId;
    }

    @GetMapping("/public")
    public String adminPublic() {
        return "This is a public endpoint inside admin controller.";
    }
}