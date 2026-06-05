package com.cms.service;

import com.cms.exception.BadRequestException;
import com.cms.exception.EmailAlreadyExistsException;
import com.cms.model.dto.AuthResponse;
import com.cms.model.dto.UserLoginRequest;
import com.cms.model.dto.UserRegisterRequest;
import com.cms.model.entity.Role;
import com.cms.model.entity.Student;
import com.cms.model.entity.User;
import com.cms.repository.StudentRepository;
import com.cms.repository.UserRepository;
import com.cms.service.impl.AuthServiceImpl;
import com.cms.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private UserRegisterRequest registerRequest;
    private UserLoginRequest loginRequest;
    private User testUser;
    private Student testStudent;

    @BeforeEach
    void setUp() {
        registerRequest = new UserRegisterRequest("student@cms.com", "password123", "password123");
        loginRequest = new UserLoginRequest("student@cms.com", "password123");
        
        testUser = User.builder()
                .id(1L)
                .email("student@cms.com")
                .passwordHash("encodedPassword")
                .role(Role.ROLE_STUDENT)
                .build();

        testStudent = Student.builder()
                .id(1L)
                .name("Student")
                .email("student@cms.com")
                .department("Computer Science & Engineering")
                .year(1)
                .user(testUser)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);
        when(jwtUtil.generateToken(any(User.class), anyString(), any(Long.class), any(Long.class))).thenReturn("mockJwtToken");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("student@cms.com", response.getEmail());
        assertEquals("ROLE_STUDENT", response.getRole());
        assertEquals("mockJwtToken", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void register_ThrowException_WhenEmailExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void register_ThrowException_WhenPasswordsDoNotMatch() {
        registerRequest.setConfirmPassword("differentPassword");

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(studentRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(testStudent));
        when(jwtUtil.generateToken(any(User.class), anyString(), any(Long.class), any(Long.class))).thenReturn("mockJwtToken");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("student@cms.com", response.getEmail());
        assertEquals("ROLE_STUDENT", response.getRole());
        assertEquals("mockJwtToken", response.getToken());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_Failure_InvalidCredentials() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
        verify(userRepository, never()).findByEmail(anyString());
    }
}
