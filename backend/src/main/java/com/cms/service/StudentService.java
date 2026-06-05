package com.cms.service;

import com.cms.model.dto.StudentResponse;
import java.util.List;

/**
 * Service interface for Student management business operations.
 */
public interface StudentService {

    /**
     * Retrieves a student by their unique ID.
     *
     * @param id the student ID
     * @return StudentResponse details
     */
    StudentResponse getStudentById(Long id);

    /**
     * Retrieves all registered students.
     *
     * @return a list of StudentResponse objects
     */
    List<StudentResponse> getAllStudents();

    /**
     * Searches for students by name or ID.
     *
     * @param query the search term (id or name)
     * @return a list of matching StudentResponse objects
     */
    List<StudentResponse> searchStudents(String query);

    /**
     * Creates a new student profile.
     *
     * @param studentDto the student details to create
     * @return the created StudentResponse
     */
    StudentResponse createStudent(StudentResponse studentDto);

    /**
     * Updates an existing student profile.
     *
     * @param id the student ID to update
     * @param studentDto the new details
     * @return the updated StudentResponse
     */
    StudentResponse updateStudent(Long id, StudentResponse studentDto);

    /**
     * Deletes a student profile by ID.
     *
     * @param id the student ID to delete
     */
    void deleteStudent(Long id);
}
