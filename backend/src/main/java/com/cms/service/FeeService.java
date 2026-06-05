package com.cms.service;

import com.cms.model.dto.FeeResponse;
import java.util.List;

/**
 * Service interface for Student Fee management.
 */
public interface FeeService {

    /**
     * Retrieves fee details for a specific student ID.
     *
     * @param studentId the student ID
     * @return FeeResponse particulars
     */
    FeeResponse getFeeByStudentId(Long studentId);

    /**
     * Retrieves all student fee records.
     *
     * @return a list of FeeResponse DTOs
     */
    List<FeeResponse> getAllFees();

    /**
     * Searches for fee structures using student ID or student name.
     *
     * @param query the search key (student name or ID)
     * @return a list of matching FeeResponse objects
     */
    List<FeeResponse> searchFees(String query);

    /**
     * Creates or updates fee parameters.
     *
     * @param feeDto the fee particulars to register/update
     * @return the created/updated FeeResponse
     */
    FeeResponse createOrUpdateFee(FeeResponse feeDto);

    /**
     * Deletes a fee record by fee ID.
     *
     * @param id the fee ID
     */
    void deleteFee(Long id);
}
