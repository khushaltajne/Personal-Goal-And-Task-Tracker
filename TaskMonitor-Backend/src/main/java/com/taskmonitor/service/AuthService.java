package com.taskmonitor.service;

import com.taskmonitor.dto.AuthResponse;
import com.taskmonitor.dto.LoginRequest;
import com.taskmonitor.dto.RegisterRequest;

public interface AuthService {

	public AuthResponse login(LoginRequest request);
	
	public void logout(String refreshToken);

	AuthResponse refreshToken(String refreshToken);

	AuthResponse register(RegisterRequest request);
}
