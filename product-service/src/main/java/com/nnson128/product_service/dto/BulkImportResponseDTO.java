package com.nnson128.product_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkImportResponseDTO {
    private Integer totalProducts;
    private Integer successCount;
    private Integer failCount;
    private List<ImportErrorDTO> errors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportErrorDTO {
        private String productName;
        private String errorMessage;
    }
}
