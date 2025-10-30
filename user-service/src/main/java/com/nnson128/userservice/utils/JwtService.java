package com.nnson128.userservice.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nnson128.userservice.dto.UserDto;
import com.nnson128.userservice.dto.response.AuthResponse;
import com.nnson128.userservice.dto.response.UserResponse;
import com.nnson128.userservice.exception.CommonException;
import com.nnson128.userservice.model.User;
import com.nnson128.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserRepository userRepository;

    public UserDto getUserInforFromToken(String jwt) {
        String token = normalize(jwt);
        if (token.isBlank()) {
            throw new CommonException("Token is required", HttpStatus.BAD_REQUEST);
        }
        Map<String, Object> claims = decodeTokenInternal(token);
        if (claims.isEmpty()) {
            throw new CommonException("Invalid JWT: payload is empty or cannot be parsed", HttpStatus.UNAUTHORIZED);
        }

        String id = safeString((String) claims.get("sub"));
        String username = safeString((String) claims.get("preferred_username"));
        String email = safeString((String) claims.get("email"));
        String firstName = safeString((String) claims.get("given_name"));
        String lastName = safeString((String) claims.get("family_name"));
        List<String> roles = getUserRolesFromToken(token);

        return UserDto.builder()
                .id(id)
                .username(username)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .roles(roles == null ? List.of() : roles)
                .build();
    }

    public void validateTokenOrThrow(String jwt) {
        String token = normalize(jwt);
        Map<String, Object> claims = decodeTokenInternal(token);
        if (claims.isEmpty()) {
            throw new CommonException("Invalid JWT: payload is empty or cannot be parsed", HttpStatus.UNAUTHORIZED);
        }
        Number exp = getNumberClaim(claims, "exp");
        if (exp == null) {
            throw new CommonException("Invalid JWT: missing 'exp' claim", HttpStatus.UNAUTHORIZED);
        }
        long nowSec = System.currentTimeMillis() / 1000;
        if (nowSec > exp.longValue()) {
            throw new CommonException("Token is expired", HttpStatus.UNAUTHORIZED);
        }

        if (safeString((String) claims.get("sub")).isEmpty()) {
            throw new CommonException("Invalid JWT: missing 'sub' claim", HttpStatus.UNAUTHORIZED);
        }
        if (safeString((String) claims.get("preferred_username")).isEmpty()) {
            throw new CommonException("Invalid JWT: missing 'preferred_username' claim", HttpStatus.UNAUTHORIZED);
        }
        if (safeString((String) claims.get("email")).isEmpty()) {
            throw new CommonException("Invalid JWT: missing 'email' claim", HttpStatus.UNAUTHORIZED);
        }
    }

    public List<String> getUserRolesFromToken(String idToken) {
        Map<String, Object> claims = decodeTokenInternal(normalize(idToken));
        @SuppressWarnings("unchecked")
        Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realm_access");
        if (realmAccess != null) {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");
            return roles != null ? roles : List.of();
        }
        return List.of();
    }

    public List<String> getUserResourceRolesFromToken(String idToken, String resourceName) {
        Map<String, Object> claims = decodeTokenInternal(normalize(idToken));
        @SuppressWarnings("unchecked")
        Map<String, Object> resourceAccess = (Map<String, Object>) claims.get("resource_access");
        if (resourceAccess != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> resource = (Map<String, Object>) resourceAccess.get(resourceName);
            if (resource != null) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) resource.get("roles");
                return roles != null ? roles : List.of();
            }
        }
        return List.of();
    }

    public boolean hasRole(String idToken, String roleName) {
        return getUserRolesFromToken(idToken).contains(roleName);
    }

    public long getIssuedAt(String token) {
        Object val = getClaimFromToken(token, "iat");
        return (val instanceof Number) ? ((Number) val).longValue() : 0L;
    }

    public long getExpiresAt(String token) {
        Object val = getClaimFromToken(token, "exp");
        return (val instanceof Number) ? ((Number) val).longValue() : 0L;
    }

    public Boolean getEmailVerified(String token) {
        Object val = getClaimFromToken(token, "email_verified");
        return (val instanceof Boolean) ? (Boolean) val : null;
    }

    public AuthResponse processIdToken(String idToken, String accessToken, String refreshToken, Long expiresIn) {
        validateTokenOrThrow(idToken);

        UserInfoFromToken userInfo = extractUserInfoFromToken(idToken);
        log.info("Extracted user info from token - Subject: {}, Email: {}", userInfo.getSubject(), userInfo.getEmail());

        User user = userRepository.findByEmail(userInfo.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userInfo.getEmail()));

        user = syncUserInfoFromToken(user, userInfo);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .idToken(idToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .user(UserResponse.fromUser(user))
                .build();
    }

    public UserInfoFromToken extractUserInfoFromToken(String idToken) {
        Map<String, Object> claims = decodeTokenInternal(normalize(idToken));
        return UserInfoFromToken.builder()
                .subject(claims.get("sub") != null ? claims.get("sub").toString() : null)
                .username(claims.get("preferred_username") != null ? claims.get("preferred_username").toString() : null)
                .email(claims.get("email") != null ? claims.get("email").toString() : null)
                .firstName(claims.get("given_name") != null ? claims.get("given_name").toString() : null)
                .lastName(claims.get("family_name") != null ? claims.get("family_name").toString() : null)
                .emailVerified(claims.get("email_verified") instanceof Boolean ? (Boolean) claims.get("email_verified") : null)
                .allClaims(claims)
                .build();
    }

    private User syncUserInfoFromToken(User user, UserInfoFromToken tokenInfo) {
        boolean updated = false;

        if (tokenInfo.getFirstName() != null && !tokenInfo.getFirstName().equals(user.getFirstname())) {
            user.setFirstname(tokenInfo.getFirstName());
            updated = true;
            log.info("Updated firstname for user {}: {} -> {}", user.getId(), user.getFirstname(), tokenInfo.getFirstName());
        }

        if (tokenInfo.getLastName() != null && !tokenInfo.getLastName().equals(user.getLastname())) {
            user.setLastname(tokenInfo.getLastName());
            updated = true;
            log.info("Updated lastname for user {}: {} -> {}", user.getId(), user.getLastname(), tokenInfo.getLastName());
        }

        // Always update keycloakId if not set
        if (user.getKeycloakId() == null || !user.getKeycloakId().equals(tokenInfo.getSubject())) {
            user.setKeycloakId(tokenInfo.getSubject());
            updated = true;
            log.info("Updated keycloakId for user {}: {} -> {}", user.getId(), user.getKeycloakId(), tokenInfo.getSubject());
        }

        if (updated) {
            return userRepository.save(user);
        }

        return user;
    }

    // =========================
    // Internal helpers
    // =========================

    private Object getClaimFromToken(String token, String claimName) {
        Map<String, Object> claims = decodeTokenInternal(normalize(token));
        return claims.get(claimName);
    }

    private Map<String, Object> decodeTokenInternal(String token) {
        if (token == null || token.isBlank()) {
            throw new CommonException("Token is required", HttpStatus.BAD_REQUEST);
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new CommonException("Invalid JWT format: expected 3 parts", HttpStatus.UNAUTHORIZED);
        }
        try {
            String payload = decodeBase64(parts[1]);
            @SuppressWarnings("unchecked")
            Map<String, Object> claims = objectMapper.readValue(
                    payload,
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
            );
            return claims != null ? claims : new HashMap<>();
        } catch (Exception e) {
            throw new CommonException("Invalid JWT: cannot decode payload", HttpStatus.UNAUTHORIZED);
        }
    }

    private static String normalize(String token) {
        if (token == null) return "";
        return token.replace("Bearer ", "").trim();
    }

    private static String decodeBase64(String encoded) {
        String base64 = encoded
                .replace('-', '+')
                .replace('_', '/');

        int padding = 4 - (base64.length() % 4);
        if (padding != 4) {
            base64 += "=".repeat(padding);
        }
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64);
            return new String(decodedBytes);
        } catch (IllegalArgumentException e) {
            throw new CommonException("Invalid Base64 segment in JWT", HttpStatus.UNAUTHORIZED);
        }
    }

    private static Number getNumberClaim(Map<String, Object> claims, String name) {
        Object v = claims.get(name);
        return (v instanceof Number) ? (Number) v : null;
    }

    private static String safeString(String s) { return s == null ? "" : s; }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserInfoFromToken {
        private String subject;           // user ID (sub claim)
        private String username;          // preferred_username
        private String email;             // email
        private String firstName;         // given_name
        private String lastName;          // family_name
        private Boolean emailVerified;    // email_verified
        private Map<String, Object> allClaims;  // toàn bộ claims để inspect nếu cần
    }
}
