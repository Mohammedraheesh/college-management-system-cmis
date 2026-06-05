package com.cms.service.impl;

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
import com.cms.service.AuthService;
import com.cms.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for handling authentication operations.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthServiceImpl(
            UserRepository userRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public AuthResponse register(UserRegisterRequest request) {
        log.debug("Attempting to register user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("User is already registered. Please login to the application.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        // Determine role: if email contains "admin" then ROLE_ADMIN, else ROLE_STUDENT
        Role role = request.getEmail().toLowerCase().contains("admin") ? Role.ROLE_ADMIN : Role.ROLE_STUDENT;

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        Long studentId = null;

        // If the registered user is a student, automatically build a profile
        if (role == Role.ROLE_STUDENT) {
            String defaultName = request.getEmail().split("@")[0];
            // Format name: replace dots/underscores with spaces and capitalize
            defaultName = defaultName.replace(".", " ").replace("_", " ");
            defaultName = Character.toUpperCase(defaultName.charAt(0)) + (defaultName.length() > 1 ? defaultName.substring(1) : "");

            Student student = Student.builder()
                    .name(defaultName)
                    .email(request.getEmail())
                    .department("Computer Science & Engineering")
                    .year(1)
                    .user(savedUser)
                    .build();

            Student savedStudent = studentRepository.save(student);
            studentId = savedStudent.getId();
            log.debug("Auto-created student profile with ID: {} for user: {}", studentId, savedUser.getEmail());
        }

        String token = jwtUtil.generateToken(savedUser, role.name(), savedUser.getId(), studentId);

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .role(role.name())
                .userId(savedUser.getId())
                .studentId(studentId)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(UserLoginRequest request) {
        log.debug("Attempting to authenticate user: {}", request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getEmail()));

        Long studentId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        String token = jwtUtil.generateToken(user, user.getRole().name(), user.getId(), studentId);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .userId(user.getId())
                .studentId(studentId)
                .build();
    }
}
