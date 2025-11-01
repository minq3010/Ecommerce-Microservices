package com.nnson128.userservice.service;

import com.nnson128.userservice.client.IdentityClient;
import com.nnson128.userservice.dto.UserDto;
import com.nnson128.userservice.dto.identity.TokenExchangeParam;
import com.nnson128.userservice.dto.identity.TokenExchangeResponse;
import com.nnson128.userservice.dto.response.UserResponse;
import com.nnson128.userservice.exception.CommonException;
import com.nnson128.userservice.repository.UserRepository;
import com.nnson128.userservice.utils.UtilsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.nnson128.userservice.model.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private static final String USER_NOT_FOUND_MESSAGE = "User not found with id: ";

    private final UserRepository userRepository;
    private final IdentityClient identityClient;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    public List<UserDto> getAllUsers(){
        try {
            // Fetch users from local database first (which has the role field)
            List<User> dbUsers = userRepository.findAll();
            if (dbUsers == null || dbUsers.isEmpty()) {
                return List.of();
            }
            
            // Get client token for Keycloak admin operations
            TokenExchangeResponse tokenResponse = identityClient.getClientToken(TokenExchangeParam.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .build());
            String accessToken = "Bearer " + tokenResponse.getAccessToken();

            // Enrich DB users with Keycloak roles
            return dbUsers.stream()
                    .map(user -> enrichUserWithKeycloakRoles(user, accessToken))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Failed to fetch users: " + e.getMessage());
            e.printStackTrace();
            // Fallback to database users without Keycloak roles
            return userRepository.findAll().stream()
                    .map(user -> UserDto.builder()
                            .id(user.getId().toString())
                            .username(user.getEmail())
                            .email(user.getEmail())
                            .firstName(user.getFirstname())
                            .lastName(user.getLastname())
                            .role(user.getRole())
                            .roles(List.of())
                            .build())
                    .collect(Collectors.toList());
        }
    }
    
    private UserDto enrichUserWithKeycloakRoles(User dbUser, String accessToken) {
        List<String> roles = List.of();
        String userId = dbUser.getId().toString();
        
        // Fetch composite roles from Keycloak (includes inherited roles from groups)
        try {
            org.springframework.http.ResponseEntity<?> compositeResponse = identityClient.getUserCompositeRoles(accessToken, userId);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> compositeRoleList = (List<Map<String, Object>>) compositeResponse.getBody();
            if (compositeRoleList != null && !compositeRoleList.isEmpty()) {
                roles = compositeRoleList.stream()
                        .map(r -> (String) r.get("name"))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch composite roles for user {}: {}", userId, e.getMessage());
        }
        
        return UserDto.builder()
                .id(dbUser.getId().toString())
                .username(dbUser.getEmail())
                .email(dbUser.getEmail())
                .firstName(dbUser.getFirstname())
                .lastName(dbUser.getLastname())
                .role(dbUser.getRole())  // Include role from DB
                .roles(roles)  // Include roles from Keycloak
                .build();
    }

    private UserDto mapKeycloakUserToUserDto(Map<String, Object> keycloakUser, String accessToken) {
        String userId = (String) keycloakUser.get("id");
        String username = (String) keycloakUser.get("username");
        String email = (String) keycloakUser.get("email");
        String firstName = (String) keycloakUser.get("firstName");
        String lastName = (String) keycloakUser.get("lastName");
        
        // Extract roles from realmAccess if available (from token data)
        List<String> roles = List.of();
        @SuppressWarnings("unchecked")
        Map<String, Object> realmAccess = (Map<String, Object>) keycloakUser.get("realmAccess");
        if (realmAccess != null) {
            @SuppressWarnings("unchecked")
            List<String> realmRoles = (List<String>) realmAccess.get("roles");
            roles = realmRoles != null ? realmRoles : List.of();
        }
        
        // If realmAccess not available, fetch roles from Keycloak API
        // First try to get composite roles (includes inherited roles from groups)
        if (userId != null && !userId.isEmpty()) {
            try {
                // Try composite roles first - includes roles inherited from groups
                org.springframework.http.ResponseEntity<?> compositeResponse = identityClient.getUserCompositeRoles(accessToken, userId);
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> compositeRoleList = (List<Map<String, Object>>) compositeResponse.getBody();
                if (compositeRoleList != null && !compositeRoleList.isEmpty()) {
                    roles = compositeRoleList.stream()
                            .map(r -> (String) r.get("name"))
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());
                }
                
                // If no composite roles found, fallback to direct realm roles
                if (roles.isEmpty()) {
                    org.springframework.http.ResponseEntity<?> roleResponse = identityClient.getUserRoles(accessToken, userId);
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> roleList = (List<Map<String, Object>>) roleResponse.getBody();
                    if (roleList != null && !roleList.isEmpty()) {
                        roles = roleList.stream()
                                .map(r -> (String) r.get("name"))
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch roles for user " + userId + ": " + e.getMessage());
            }
        }

        return UserDto.builder()
                .id(userId)
                .username(username)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .roles(roles)
                .build();
    }
    
    // This method is deprecated - use enrichUserWithKeycloakRoles instead
    // Kept for backward compatibility if needed


    public void deleteUsers(List<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw new IllegalArgumentException("User IDs cannot be empty");
        }

        // Get client token for Keycloak admin operations
        TokenExchangeResponse tokenResponse = identityClient.getClientToken(TokenExchangeParam.builder()
                .grant_type("client_credentials")
                .client_id(clientId)
                .client_secret(clientSecret)
                .build());
        String accessToken = "Bearer " + tokenResponse.getAccessToken();

        // Delete from Keycloak first
        for (UUID userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + userId, HttpStatus.NOT_FOUND));
            // use keycloakId if stored, otherwise fall back to the local user id (many registrations set id = keycloak id)
            String kcId = user.getKeycloakId() != null && !user.getKeycloakId().isBlank()
                    ? user.getKeycloakId()
                    : (user.getId() != null ? user.getId().toString() : null);
            if (kcId != null) {
                try {
                    identityClient.deleteUser(accessToken, kcId);
                } catch (Exception e) {
                    // Log error but continue with DB deletion
                    System.err.println("Failed to delete user from Keycloak: " + kcId + ", error: " + e.getMessage());
                }
            }
        }

        // Delete from database
        userRepository.deleteAllByIdInBatch(userIds);
    }


    public UserResponse getUserById(@PathVariable UUID id) {
        if(userRepository.findById(id).isPresent()) {
            return UserResponse.fromUser(userRepository.findById(id).get());
        }
        throw new CommonException("User with id " + id + " not found.", HttpStatus.NOT_FOUND);
    }

    public UserResponse updateUser(@PathVariable UUID id, @RequestBody User request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + id, HttpStatus.NOT_FOUND));
        
        // Update firstname and lastname if provided
        if (request.getFirstname() != null && !request.getFirstname().isBlank()) {
            existingUser.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null && !request.getLastname().isBlank()) {
            existingUser.setLastname(request.getLastname());
        }
        
        // Update role if provided
        if (request.getRole() != null && !request.getRole().isBlank()) {
            String newRole = request.getRole().toUpperCase();
            String oldRole = existingUser.getRole();
            
            // Only update if role changed
            if (!newRole.equals(oldRole)) {
                existingUser.setRole(newRole);
                
                // Update role in Keycloak (move user from old group to new group)
                try {
                    updateUserGroupInKeycloak(id.toString(), oldRole, newRole);
                } catch (Exception e) {
                    log.error("Failed to update user group in Keycloak: {}", e.getMessage());
                    // Continue with DB update anyway
                }
            }
        }
        
        User savedUser = userRepository.save(existingUser);
        return UserResponse.fromUser(savedUser);
    }
    
    private void updateUserGroupInKeycloak(String userId, String oldRole, String newRole) {
        try {
            // Get admin token
            TokenExchangeResponse tokenResponse = identityClient.getClientToken(TokenExchangeParam.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .build());
            String accessToken = "Bearer " + tokenResponse.getAccessToken();
            
            // Map roles to group names
            String oldGroupName = roleToGroupName(oldRole);
            String newGroupName = roleToGroupName(newRole);
            
            // Search and find old group
            ResponseEntity<?> oldGroupsResp = identityClient.searchGroups(accessToken, oldGroupName);
            if (oldGroupsResp.getStatusCode().is2xxSuccessful() && oldGroupsResp.getBody() instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> oldGroups = (List<Map<String, Object>>) oldGroupsResp.getBody();
                if (!oldGroups.isEmpty()) {
                    String oldGroupId = (String) oldGroups.get(0).get("id");
                    // Remove user from old group
                    try {
                        identityClient.removeUserFromGroup(accessToken, userId, oldGroupId);
                    } catch (Exception e) {
                        log.warn("Could not remove user from old group: {}", e.getMessage());
                    }
                }
            }
            
            // Search and find new group
            ResponseEntity<?> newGroupsResp = identityClient.searchGroups(accessToken, newGroupName);
            if (newGroupsResp.getStatusCode().is2xxSuccessful() && newGroupsResp.getBody() instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> newGroups = (List<Map<String, Object>>) newGroupsResp.getBody();
                if (!newGroups.isEmpty()) {
                    String newGroupId = (String) newGroups.get(0).get("id");
                    // Add user to new group
                    identityClient.addUserToGroup(accessToken, userId, newGroupId);
                }
            }
        } catch (Exception e) {
            log.error("Error updating user group in Keycloak: {}", e.getMessage());
            throw new CommonException("Failed to update user group in Keycloak", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    private String roleToGroupName(String role) {
        if (role == null) return "default groups";
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "admin group";
            case "STAFF":
                return "staff group";
            default:
                return "default groups";
        }
    }

    public UserResponse getUserProfile(UUID userId){
        return getUserById(userId);
    }

    public UserResponse updateUserProfile(UUID userId, User updateRequest) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + userId, HttpStatus.NOT_FOUND));
        
        // Only update firstname and lastname
        if (updateRequest.getFirstname() != null) {
            existingUser.setFirstname(updateRequest.getFirstname());
        }
        if (updateRequest.getLastname() != null) {
            existingUser.setLastname(updateRequest.getLastname());
        }
        
        User savedUser = userRepository.save(existingUser);
        return UserResponse.fromUser(savedUser);
    }

    public UserResponse updateUserAvatarLegacy(UUID userId) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + userId, HttpStatus.NOT_FOUND));
        return UserResponse.fromUser(existingUser);
    }

    public UserResponse searchUserByPhone(String phone) {
        // Normalize the search phone number
        String normalizedPhone = UtilsService.normalizeVietnamesePhone(phone);
        
        User user = userRepository.findByPhone(normalizedPhone)
                .orElseThrow(() -> new CommonException("User not found with phone: " + phone, HttpStatus.NOT_FOUND));
        return UserResponse.fromUser(user);
    }

    public void updateUserAvatar(UUID userId, String avatarUrl, String avatarPublicId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + userId, HttpStatus.NOT_FOUND));
        user.setAvatarUrl(avatarUrl);
        user.setAvatarPublicId(avatarPublicId);
        userRepository.save(user);
    }

    public String getUserAvatarUrl(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + userId, HttpStatus.NOT_FOUND));
        return user.getAvatarUrl();
    }

    public String getUserAvatarPublicId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CommonException(USER_NOT_FOUND_MESSAGE + userId, HttpStatus.NOT_FOUND));
        return user.getAvatarPublicId();
    }

}