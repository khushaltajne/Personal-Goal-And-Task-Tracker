package com.taskmonitor.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmonitor.dto.dashboard.AdminDashboardDTO.UserSummaryDTO;
import com.taskmonitor.dto.dashboard.AdminUserUpdateDTO;
import com.taskmonitor.entity.AppUser;
import com.taskmonitor.exception.ResourceNotFoundException;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.service.AdminUserService;
import com.taskmonitor.utility.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> UserSummaryDTO.builder()
                        .id(u.getId())
                        .username(u.getDisplayUsername())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .enabled(u.isEnabled())
                        .build())
                .toList();
    }

    @Override
    public void updateUser(Long id, AdminUserUpdateDTO dto) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (dto.username() != null && !dto.username().isBlank()) {
            user.setUsername(dto.username());
        }
        if (dto.email() != null && !dto.email().isBlank()) {
            user.setEmail(dto.email());
        }
        if (dto.role() != null && !dto.role().isBlank()) {
            user.setRole(Role.valueOf(dto.role()));
        }
        user.setEnabled(dto.enabled());

        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}
