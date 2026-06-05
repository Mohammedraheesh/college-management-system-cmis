package com.cms.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "internal_marks", nullable = false)
    private Double internalMarks;

    @Column(name = "end_exam_marks", nullable = false)
    private Double endExamMarks;

    @Column(nullable = false)
    private Double total;

    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        double internal = (this.internalMarks != null) ? this.internalMarks : 0.0;
        double end = (this.endExamMarks != null) ? this.endExamMarks : 0.0;
        this.total = internal + end;
    }
}
