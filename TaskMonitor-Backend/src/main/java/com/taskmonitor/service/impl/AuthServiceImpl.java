package com.taskmonitor.service.impl;

import com.taskmonitor.dto.*;
import com.taskmonitor.entity.*;
import com.taskmonitor.repository.*;
import com.taskmonitor.security.JwtService;
import com.taskmonitor.service.AuthService;
import com.taskmonitor.service.RefreshTokenService;
import com.taskmonitor.utility.Role;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // ===============================
    // 🔹 REGISTER
    // ===============================
    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }

        AppUser user = AppUser.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_USER)
                .enabled(true)
                .emailVerified(false)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    // ===============================
    // 🔹 LOGIN
    // ===============================
    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        AppUser user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        String accessToken = jwtService.generateAccessToken(user);

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    // ===============================
    // 🔹 REFRESH TOKEN
    // ===============================
    @Override
    public AuthResponse refreshToken(String refreshTokenValue) {

        RefreshToken token = refreshTokenRepository
                .findByToken(refreshTokenValue)
                .orElseThrow(() ->
                        new RuntimeException("Invalid refresh token")
                );

        refreshTokenService.verifyExpiration(token);

        AppUser user = token.getUser();

        String newAccessToken =
                jwtService.generateAccessToken(user);

        // 🔥 ROTATE refresh token
        refreshTokenService.deleteByUser(user);

        RefreshToken newRefreshToken =
                refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .build();
    }

    // ===============================
    // 🔹 LOGOUT
    // ===============================
    @Override
    public void logout(String refreshTokenValue) {

        RefreshToken token = refreshTokenRepository
                .findByToken(refreshTokenValue)
                .orElseThrow(() ->
                        new RuntimeException("Token not found")
                );

        refreshTokenRepository.delete(token);
    }
}