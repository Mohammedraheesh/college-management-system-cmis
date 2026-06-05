package com.cms.controller;

import com.cms.model.dto.FeeResponse;
import com.cms.model.response.ApiResponse;
import com.cms.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fees")
@Tag(name = "Fee Controller", description = "Endpoints for managing student fees and dues")
public class FeeController {

    private final FeeService feeService;

    @Autowired
    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    @Operation(summary = "Get all fee records", description = "Retrieves all fee records, or searches them using a student name or ID.")
    public ResponseEntity<ApiResponse<List<FeeResponse>>> getFees(@RequestParam(value = "query", required = false) String query) {
        List<FeeResponse> fees = feeService.searchFees(query);
        return ResponseEntity.ok(ApiResponse.success("Fee records retrieved successfully", fees));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student fee record", description = "Retrieves the fee summary for a student by their student ID.")
    public ResponseEntity<ApiResponse<FeeResponse>> getFeeByStudentId(@PathVariable Long studentId) {
        FeeResponse fee = feeService.getFeeByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student fee record retrieved successfully", fee));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Save fee record", description = "ADMIN ONLY. Registers or updates a student's fee details.")
    public ResponseEntity<ApiResponse<FeeResponse>> saveFee(@RequestBody FeeResponse feeDto) {
        FeeResponse response = feeService.createOrUpdateFee(feeDto);
        return ResponseEntity.ok(ApiResponse.success("Fee record saved successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete fee record", description = "ADMIN ONLY. Deletes a student's fee record by the fee ID.")
    public ResponseEntity<ApiResponse<Void>> deleteFee(@PathVariable Long id) {
        feeService.deleteFee(id);
        return ResponseEntity.ok(ApiResponse.success("Fee record deleted successfully", null));
    }
}
