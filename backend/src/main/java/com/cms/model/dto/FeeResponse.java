package com.cms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private BigDecimal totalFee;
    private BigDecimal amountPaid;
    private BigDecimal balanceDue;
    private LocalDate dueDate;
}
