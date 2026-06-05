package com.cms.service;

import com.cms.model.dto.MarksResponse;
import java.util.List;

/**
 * Service interface for Student Academic Marks management.
 */
public interface MarkService {

    /**
     * Retrieves academic marks for a specific student ID.
     *
     * @param studentId the student ID
     * @return a list of MarksResponse details
     */
    List<MarksResponse> getMarksByStudentId(Long studentId);

    /**
     * Retrieves all marks records.
     *
     * @return a list of MarksResponse DTOs
     */
    List<MarksResponse> getAllMarks();

    /**
     * Searches for marks records matching student ID or name.
     *
     * @param query the search key (student name or ID)
     * @return a list of matching MarksResponse objects
     */
    List<MarksResponse> searchMarks(String query);

    /**
     * Creates or updates a marks entry.
     *
     * @param markDto the marks details to save
     * @return the created/updated MarksResponse
     */
    MarksResponse createOrUpdateMark(MarksResponse markDto);

    /**
     * Deletes a marks record by ID.
     *
     * @param id the marks ID to delete
     */
    void deleteMark(Long id);
}
