package com.nnson128.notification_service.kafka.consumer;

import com.nnson128.avro.model.OrderEvent;
import com.nnson128.avro.model.UserEvent;

import org.apache.avro.specific.SpecificRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumerService {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumerService.class);

    @KafkaListener(topics = "order_events", groupId = "notification_group")
    public void handleEvents(SpecificRecord event) {
        log.info("Received Avro event: {}", event.getClass().getSimpleName());

        if (event instanceof OrderEvent orderEvent) {
            log.info("Handling OrderEvent...");
            log.info("Sending order notification email to: {}", orderEvent.getCustomerEmail().toString());

        } else if (event instanceof UserEvent userEvent) {
            log.info("Handling UserEvent...");
            log.info("Sending welcome email to: {}", userEvent.getEmail().toString());

        } else {
            log.warn("Unknown Avro event type received: {}", event);
        }
    }
}