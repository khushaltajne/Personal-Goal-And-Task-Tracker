package com.taskmonitor.controller;

import com.taskmonitor.dto.*;
import com.taskmonitor.entity.RefreshToken;
import com.taskmonitor.repository.RefreshTokenRepository;
import com.taskmonitor.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // =============================
    // 🔹 REGISTER
    // =============================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
          @Valid  @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // =============================
    // 🔹 LOGIN
    // =============================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
          @Valid  @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // =============================
    // 🔹 REFRESH TOKEN
    // =============================
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        return ResponseEntity.ok(
                authService.refreshToken(refreshToken)
        );
    }

    // =============================
    // 🔹 LOGOUT
    // =============================
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestParam String refreshToken) {

        authService.logout(refreshToken);

        return ResponseEntity.noContent().build();
    }
}