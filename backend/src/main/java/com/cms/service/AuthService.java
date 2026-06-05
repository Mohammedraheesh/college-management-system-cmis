package com.cms.service;

import com.cms.model.dto.AuthResponse;
import com.cms.model.dto.UserLoginRequest;
import com.cms.model.dto.UserRegisterRequest;

/**
 * Service interface for handling User authentication and registration processes.
 */
public interface AuthService {

    /**
     * Registers a new user. If the email already exists, throws EmailAlreadyExistsException.
     * If passwords do not match, throws BadRequestException.
     *
     * @param request the registration details
     * @return AuthResponse containing token and user details
     */
    AuthResponse register(UserRegisterRequest request);

    /**
     * Logins an existing user.
     *
     * @param request the credentials
     * @return AuthResponse containing token and user details
     */
    AuthResponse login(UserLoginRequest request);
}
