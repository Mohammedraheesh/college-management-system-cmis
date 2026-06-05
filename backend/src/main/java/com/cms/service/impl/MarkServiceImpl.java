package com.cms.service.impl;

import com.cms.exception.ResourceNotFoundException;
import com.cms.model.dto.MarksResponse;
import com.cms.model.entity.Course;
import com.cms.model.entity.Mark;
import com.cms.model.entity.Student;
import com.cms.repository.CourseRepository;
import com.cms.repository.MarkRepository;
import com.cms.repository.StudentRepository;
import com.cms.service.MarkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing Mark entities.
 */
@Service
public class MarkServiceImpl implements MarkService {

    private static final Logger log = LoggerFactory.getLogger(MarkServiceImpl.class);

    private final MarkRepository markRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public MarkServiceImpl(
            MarkRepository markRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository
    ) {
        this.markRepository = markRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarksResponse> getMarksByStudentId(Long studentId) {
        log.debug("Fetching marks for student ID: {}", studentId);
        return markRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarksResponse> getAllMarks() {
        log.debug("Fetching all marks records");
        return markRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarksResponse> searchMarks(String query) {
        log.debug("Searching marks for query: {}", query);
        if (query == null || query.trim().isEmpty()) {
            return getAllMarks();
        }
        return markRepository.searchMarksByStudent(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MarksResponse createOrUpdateMark(MarksResponse markDto) {
        log.debug("Saving marks for student ID: {} and course ID: {}", markDto.getStudentId(), markDto.getCourseId());
        
        Student student = studentRepository.findById(markDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + markDto.getStudentId()));

        Course course = courseRepository.findById(markDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + markDto.getCourseId()));

        // Check if marks already exist for this student and course. If so, update.
        Mark mark = markRepository.findByStudentIdAndCourseId(markDto.getStudentId(), markDto.getCourseId())
                .orElse(new Mark());

        mark.setStudent(student);
        mark.setCourse(course);
        mark.setInternalMarks(markDto.getInternalMarks());
        mark.setEndExamMarks(markDto.getEndExamMarks());
        
        // Note: total is automatically calculated via @PrePersist / @PreUpdate inside the Mark entity
        Mark savedMark = markRepository.save(mark);
        return mapToDto(savedMark);
    }

    @Override
    @Transactional
    public void deleteMark(Long id) {
        log.debug("Deleting marks record with ID: {}", id);
        if (!markRepository.existsById(id)) {
            throw new ResourceNotFoundException("Marks record not found with ID: " + id);
        }
        markRepository.deleteById(id);
    }

    private MarksResponse mapToDto(Mark mark) {
        return MarksResponse.builder()
                .id(mark.getId())
                .studentId(mark.getStudent().getId())
                .studentName(mark.getStudent().getName())
                .courseId(mark.getCourse().getId())
                .courseName(mark.getCourse().getCourseName())
                .courseCode(mark.getCourse().getCourseCode())
                .internalMarks(mark.getInternalMarks())
                .endExamMarks(mark.getEndExamMarks())
                .total(mark.getTotal())
                .build();
    }
}
