package com.cms.repository;

import com.cms.model.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudentId(Long studentId);

    java.util.Optional<Mark> findByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("SELECT m FROM Mark m WHERE " +
           "LOWER(m.student.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "CAST(m.student.id AS string) LIKE CONCAT('%', :query, '%')")
    List<Mark> searchMarksByStudent(@Param("query") String query);
}
