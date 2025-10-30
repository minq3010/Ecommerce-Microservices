package com.nnson128.notification_service.grpc;

import com.nnson128.grpc.notification.NotificationRequest;
import com.nnson128.grpc.notification.NotificationResponse;
import com.nnson128.grpc.notification.NotificationServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class NotificationGrpcService extends NotificationServiceGrpc.NotificationServiceImplBase {
    @Override
    public void sendNotification(NotificationRequest request, StreamObserver<NotificationResponse> responseObserver) {
        System.out.println("Received notification request: " + request.getMessage());
        NotificationResponse response = NotificationResponse.newBuilder()
                .setStatus("Notification sent successfully!")
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
