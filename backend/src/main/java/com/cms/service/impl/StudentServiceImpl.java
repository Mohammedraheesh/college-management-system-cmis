package com.cms.service.impl;

import com.cms.exception.ResourceNotFoundException;
import com.cms.model.dto.StudentResponse;
import com.cms.model.entity.Student;
import com.cms.model.entity.User;
import com.cms.repository.StudentRepository;
import com.cms.repository.UserRepository;
import com.cms.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing Student entities.
 */
@Service
public class StudentServiceImpl implements StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        log.debug("Fetching student details for ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        log.debug("Fetching all student records");
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> searchStudents(String query) {
        log.debug("Searching students matching query: {}", query);
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentResponse createStudent(StudentResponse studentDto) {
        log.debug("Creating new student profile: {}", studentDto.getEmail());
        User user = null;
        if (studentDto.getUserId() != null) {
            user = userRepository.findById(studentDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Associated User not found with ID: " + studentDto.getUserId()));
        }

        Student student = Student.builder()
                .name(studentDto.getName())
                .email(studentDto.getEmail())
                .department(studentDto.getDepartment())
                .year(studentDto.getYear())
                .user(user)
                .build();

        Student savedStudent = studentRepository.save(student);
        return mapToDto(savedStudent);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentResponse studentDto) {
        log.debug("Updating student profile for ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        student.setName(studentDto.getName());
        student.setEmail(studentDto.getEmail());
        student.setDepartment(studentDto.getDepartment());
        student.setYear(studentDto.getYear());

        if (studentDto.getUserId() != null) {
            User user = userRepository.findById(studentDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Associated User not found with ID: " + studentDto.getUserId()));
            student.setUser(user);
        }

        Student updatedStudent = studentRepository.save(student);
        return mapToDto(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        log.debug("Deleting student with ID: {}", id);
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentResponse mapToDto(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .department(student.getDepartment())
                .year(student.getYear())
                .userId(student.getUser() != null ? student.getUser().getId() : null)
                .build();
    }
}
