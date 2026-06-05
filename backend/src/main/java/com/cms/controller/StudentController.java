package com.cms.controller;

import com.cms.model.dto.MarksResponse;
import com.cms.model.dto.StudentResponse;
import com.cms.model.response.ApiResponse;
import com.cms.service.MarkService;
import com.cms.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Student Controller", description = "Endpoints for managing student profiles and marks")
public class StudentController {

    private final StudentService studentService;
    private final MarkService markService;

    @Autowired
    public StudentController(StudentService studentService, MarkService markService) {
        this.studentService = studentService;
        this.markService = markService;
    }

    @GetMapping
    @Operation(summary = "Get students", description = "Retrieves all students, or searches for students matching a query.")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getStudents(@RequestParam(value = "query", required = false) String query) {
        List<StudentResponse> students = studentService.searchStudents(query);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID", description = "Retrieves particulars of a student profile by their ID.")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student details retrieved successfully", student));
    }

    @GetMapping("/{id}/marks")
    @Operation(summary = "Get student marks by student ID", description = "Retrieves internal and external exam marks for a student.")
    public ResponseEntity<ApiResponse<List<MarksResponse>>> getStudentMarks(@PathVariable("id") Long studentId) {
        List<MarksResponse> marks = markService.getMarksByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student marks retrieved successfully", marks));
    }

    @GetMapping("/marks/search")
    @Operation(summary = "Search marks by student name or ID", description = "Searches for academic marks matching student name or ID query.")
    public ResponseEntity<ApiResponse<List<MarksResponse>>> searchMarks(@RequestParam("query") String query) {
        List<MarksResponse> marks = markService.searchMarks(query);
        return ResponseEntity.ok(ApiResponse.success("Marks search completed successfully", marks));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create student profile", description = "ADMIN ONLY. Creates a new student record.")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@RequestBody StudentResponse studentDto) {
        StudentResponse response = studentService.createStudent(studentDto);
        return ResponseEntity.ok(ApiResponse.success("Student profile created successfully", response));
    }

    @PostMapping("/marks")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Record student marks", description = "ADMIN ONLY. Creates or updates academic marks for a course.")
    public ResponseEntity<ApiResponse<MarksResponse>> recordStudentMarks(@RequestBody MarksResponse marksDto) {
        MarksResponse response = markService.createOrUpdateMark(marksDto);
        return ResponseEntity.ok(ApiResponse.success("Marks saved successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update student profile", description = "ADMIN ONLY. Updates details of an existing student profile.")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@PathVariable Long id, @RequestBody StudentResponse studentDto) {
        StudentResponse response = studentService.updateStudent(id, studentDto);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete student profile", description = "ADMIN ONLY. Deletes student record by ID.")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student profile deleted successfully", null));
    }
}
