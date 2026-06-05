package com.cms.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(name = "total_fee", nullable = false)
    private BigDecimal totalFee;

    @Column(name = "amount_paid", nullable = false)
    private BigDecimal amountPaid;

    @Column(name = "balance_due", nullable = false)
    private BigDecimal balanceDue;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @PrePersist
    @PreUpdate
    public void calculateBalance() {
        BigDecimal total = (this.totalFee != null) ? this.totalFee : BigDecimal.ZERO;
        BigDecimal paid = (this.amountPaid != null) ? this.amountPaid : BigDecimal.ZERO;
        this.balanceDue = total.subtract(paid);
    }
}
