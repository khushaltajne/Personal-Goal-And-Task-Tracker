package com.taskmonitor.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmonitor.dto.dashboard.AdminDashboardDTO.UserSummaryDTO;
import com.taskmonitor.dto.dashboard.AdminUserUpdateDTO;
import com.taskmonitor.service.AdminUserService;

import lombok.RequiredArgsConstructor;

/**
 * Admin user management endpoints.
 * Access is enforced in SecurityConfig via hasAuthority("ROLE_ADMIN")
 * on all /api/admin/** requests — more reliable than AOP @PreAuthorize for
 * HTTP verbs like DELETE and PUT.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody AdminUserUpdateDTO dto) {
        adminUserService.updateUser(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
