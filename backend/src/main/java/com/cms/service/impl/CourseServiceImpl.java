package com.cms.service.impl;

import com.cms.exception.BadRequestException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.model.dto.CourseResponse;
import com.cms.model.entity.Course;
import com.cms.repository.CourseRepository;
import com.cms.service.CourseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing Course entities.
 */
@Service
public class CourseServiceImpl implements CourseService {

    private static final Logger log = LoggerFactory.getLogger(CourseServiceImpl.class);

    private final CourseRepository courseRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        log.debug("Fetching all courses");
        return courseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        log.debug("Fetching course details for ID: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));
        return mapToDto(course);
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseResponse courseDto) {
        log.debug("Creating new course: {}", courseDto.getCourseCode());
        if (courseRepository.existsByCourseCode(courseDto.getCourseCode())) {
            throw new BadRequestException("Course with course code " + courseDto.getCourseCode() + " already exists");
        }

        Course course = Course.builder()
                .courseName(courseDto.getCourseName())
                .courseCode(courseDto.getCourseCode())
                .department(courseDto.getDepartment())
                .credits(courseDto.getCredits())
                .description(courseDto.getDescription())
                .build();

        Course savedCourse = courseRepository.save(course);
        return mapToDto(savedCourse);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(Long id, CourseResponse courseDto) {
        log.debug("Updating course details for ID: {}", id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));

        // Check if course code is being changed and already exists
        if (!course.getCourseCode().equals(courseDto.getCourseCode()) && 
            courseRepository.existsByCourseCode(courseDto.getCourseCode())) {
            throw new BadRequestException("Course with course code " + courseDto.getCourseCode() + " already exists");
        }

        course.setCourseName(courseDto.getCourseName());
        course.setCourseCode(courseDto.getCourseCode());
        course.setDepartment(courseDto.getDepartment());
        course.setCredits(courseDto.getCredits());
        course.setDescription(courseDto.getDescription());

        Course updatedCourse = courseRepository.save(course);
        return mapToDto(updatedCourse);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        log.debug("Deleting course with ID: {}", id);
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with ID: " + id);
        }
        courseRepository.deleteById(id);
    }

    private CourseResponse mapToDto(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .courseCode(course.getCourseCode())
                .department(course.getDepartment())
                .credits(course.getCredits())
                .description(course.getDescription())
                .build();
    }
}
