package com.nnson128.userservice.client;

import com.nnson128.userservice.dto.identity.TokenExchangeParam;
import com.nnson128.userservice.dto.identity.TokenExchangeResponse;
import com.nnson128.userservice.dto.identity.UserCreationParam;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "identity-client", url = "${keycloak.auth-server-url}")
public interface IdentityClient {
    @PostMapping(value = "/realms/app-realms/protocol/openid-connect/token",
            consumes = "application/x-www-form-urlencoded")
    TokenExchangeResponse getClientToken(@QueryMap TokenExchangeParam params);

    @PostMapping(value = "/realms/app-realms/protocol/openid-connect/token",
            consumes = "application/x-www-form-urlencoded")
    TokenExchangeResponse getUserToken(@QueryMap TokenExchangeParam params);


    @PostMapping(value = "/admin/realms/app-realms/users",
            consumes = "application/json")
    ResponseEntity<?> createUser(
            @RequestHeader("authorization") String token,
            @RequestBody UserCreationParam param);

    @DeleteMapping(value = "/admin/realms/app-realms/users/{userId}")
    ResponseEntity<?> deleteUser(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId);

    @GetMapping(value = "/admin/realms/app-realms/users")
    ResponseEntity<?> getAllUsers(
            @RequestHeader("authorization") String token,
            @RequestParam(value = "briefRepresentation", defaultValue = "false") boolean briefRepresentation);

    @GetMapping(value = "/admin/realms/app-realms/users/{userId}/role-mappings/realm")
    ResponseEntity<?> getUserRoles(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId);

    @GetMapping(value = "/admin/realms/app-realms/users/{userId}/role-mappings/realm/composite")
    ResponseEntity<?> getUserCompositeRoles(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId);

    @GetMapping(value = "/admin/realms/app-realms/groups")
    ResponseEntity<?> searchGroups(
            @RequestHeader("authorization") String token,
            @RequestParam(value = "search", required = false) String search);

    @PutMapping(value = "/admin/realms/app-realms/users/{userId}/groups/{groupId}")
    ResponseEntity<?> addUserToGroup(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @PathVariable("groupId") String groupId);

    @DeleteMapping(value = "/admin/realms/app-realms/users/{userId}/groups/{groupId}")
    ResponseEntity<?> removeUserFromGroup(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId,
            @PathVariable("groupId") String groupId);

}
