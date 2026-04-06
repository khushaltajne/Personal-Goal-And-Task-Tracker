package com.taskmonitor.dto.dashboard;

public record AdminUserUpdateDTO(String username, String email, String role, boolean enabled) {
}
