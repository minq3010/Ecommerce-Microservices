package com.nnson128.userservice.dto.request;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class DeleteUsersRequest {
    private List<UUID> userIds;
}

