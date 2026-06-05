package com.cms.service;

import com.cms.model.dto.CourseResponse;
import java.util.List;

/**
 * Service interface for Course management business operations.
 */
public interface CourseService {

    /**
     * Retrieves all course listings.
     *
     * @return a list of CourseResponse DTOs
     */
    List<CourseResponse> getAllCourses();

    /**
     * Retrieves a single course by its ID.
     *
     * @param id the course ID
     * @return CourseResponse details
     */
    CourseResponse getCourseById(Long id);

    /**
     * Creates a new course list.
     *
     * @param courseDto the course details to create
     * @return the created CourseResponse
     */
    CourseResponse createCourse(CourseResponse courseDto);

    /**
     * Updates details of an existing course.
     *
     * @param id the course ID to update
     * @param courseDto the new particulars
     * @return the updated CourseResponse
     */
    CourseResponse updateCourse(Long id, CourseResponse courseDto);

    /**
     * Removes a course by its ID.
     *
     * @param id the course ID to delete
     */
    void deleteCourse(Long id);
}
