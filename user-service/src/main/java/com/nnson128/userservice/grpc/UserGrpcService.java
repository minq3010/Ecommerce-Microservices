package com.nnson128.userservice.grpc;

import com.nnson128.grpc.user.GetUserFromJwtRequest;
import com.nnson128.grpc.user.UserMessage;
import com.nnson128.grpc.user.UserServiceGrpc;
import com.nnson128.userservice.dto.UserDto;
import com.nnson128.userservice.utils.JwtService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.List;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class UserGrpcService extends UserServiceGrpc.UserServiceImplBase {

    private final JwtService jwtService;

    @Override
    public void getUserFromJwt(GetUserFromJwtRequest request, StreamObserver<UserMessage> responseObserver){
        String token = request.getToken();
        UserDto dto = jwtService.getUserInforFromToken(request.getToken());
        List<String> roles = dto.getRoles();

        UserMessage user = UserMessage.newBuilder()
                .setId(dto.getId())
                .setUsername(dto.getUsername())
                .setEmail(dto.getEmail())
                .setFirstName(dto.getFirstName())
                .setLastName(dto.getLastName())
                .addAllRoles(roles == null ? java.util.List.of() : roles)
                .build();

        responseObserver.onNext(user);
        responseObserver.onCompleted();

    }
}
