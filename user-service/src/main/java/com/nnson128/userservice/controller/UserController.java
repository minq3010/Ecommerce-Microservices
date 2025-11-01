package com.nnson128.userservice.controller;

import com.nnson128.userservice.dto.ApiResponse;
import com.nnson128.userservice.dto.UserDto;
import com.nnson128.userservice.dto.request.DeleteUsersRequest;
import com.nnson128.userservice.dto.response.UserResponse;
import com.nnson128.userservice.model.User;
import com.nnson128.userservice.service.UserService;
import com.nnson128.userservice.utils.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Successfully retrieved all users")
                .success(true)
                .data(userService.getAllUsers())
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or #id == authentication.principal.subject")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @GetMapping("/search/phone")
    public ResponseEntity<ApiResponse<UserResponse>> searchUserByPhone(@RequestParam("phone") String phone) {
        UserResponse user = userService.searchUserByPhone(phone);
        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User found successfully")
                .data(user)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok().body(ApiResponse.builder()
                .message("User profile")
                .success(true)
                .data(jwtService.getUserInforFromToken(jwt.getTokenValue()))
                .build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable UUID userId) {
        log.info("Fetching user with id: {}", userId);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .message("User profile")
                .success(true)
                .data(userService.getUserProfile(userId))
                .build());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody User updateRequest) {
        String userId = jwt != null ? jwt.getSubject() : null;
        log.info("Updating user profile with id: {}", userId);
        UserResponse updatedUser = userService.updateUserProfile(UUID.fromString(userId), updateRequest);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .message("User profile updated successfully")
                .success(true)
                .data(updatedUser)
                .build());
    }

    @PutMapping("/me/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserAvatar(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("avatar") MultipartFile avatar) {
        String userId = jwt != null ? jwt.getSubject() : null;
        log.info("Updating user avatar with id: {}", userId);
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .success(false)
                .message("Please use /api/v1/users/{userId}/avatar endpoint for avatar upload")
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        userService.deleteUsers(List.of(id));
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User deleted successfully")
                .data(id)
                .build());
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> deleteUsers(@RequestBody DeleteUsersRequest request) {
        userService.deleteUsers(request.getUserIds());
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Deleted users: " + request.getUserIds().size())
                .data(request.getUserIds())
                .build());
    }

}