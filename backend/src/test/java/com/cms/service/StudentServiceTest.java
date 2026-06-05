package com.cms.service;

import com.cms.exception.ResourceNotFoundException;
import com.cms.model.dto.StudentResponse;
import com.cms.model.entity.Student;
import com.cms.model.entity.User;
import com.cms.repository.StudentRepository;
import com.cms.repository.UserRepository;
import com.cms.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student1;
    private Student student2;
    private StudentResponse studentDto;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("student1@cms.com").build();
        
        student1 = Student.builder()
                .id(1L)
                .name("Alice")
                .email("student1@cms.com")
                .department("CSE")
                .year(1)
                .user(testUser)
                .build();

        student2 = Student.builder()
                .id(2L)
                .name("Bob")
                .email("student2@cms.com")
                .department("ECE")
                .year(2)
                .build();

        studentDto = StudentResponse.builder()
                .id(1L)
                .name("Alice")
                .email("student1@cms.com")
                .department("CSE")
                .year(1)
                .userId(1L)
                .build();
    }

    @Test
    void getStudentById_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student1));

        StudentResponse result = studentService.getStudentById(1L);

        assertNotNull(result);
        assertEquals("Alice", result.getName());
        assertEquals("student1@cms.com", result.getEmail());
    }

    @Test
    void getStudentById_ThrowsException_WhenNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.getStudentById(99L));
    }

    @Test
    void getAllStudents_Success() {
        when(studentRepository.findAll()).thenReturn(List.of(student1, student2));

        List<StudentResponse> list = studentService.getAllStudents();

        assertNotNull(list);
        assertEquals(2, list.size());
        assertEquals("Alice", list.get(0).getName());
        assertEquals("Bob", list.get(1).getName());
    }

    @Test
    void searchStudents_Success() {
        when(studentRepository.searchStudents("Ali")).thenReturn(List.of(student1));

        List<StudentResponse> list = studentService.searchStudents("Ali");

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Alice", list.get(0).getName());
    }

    @Test
    void createStudent_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(studentRepository.save(any(Student.class))).thenReturn(student1);

        StudentResponse result = studentService.createStudent(studentDto);

        assertNotNull(result);
        assertEquals("Alice", result.getName());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void updateStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student1));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(studentRepository.save(any(Student.class))).thenReturn(student1);

        StudentResponse result = studentService.updateStudent(1L, studentDto);

        assertNotNull(result);
        assertEquals("Alice", result.getName());
    }

    @Test
    void deleteStudent_Success() {
        when(studentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1L);

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteStudent_ThrowsException_WhenNotFound() {
        when(studentRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> studentService.deleteStudent(99L));
        verify(studentRepository, never()).deleteById(anyLong());
    }
}
