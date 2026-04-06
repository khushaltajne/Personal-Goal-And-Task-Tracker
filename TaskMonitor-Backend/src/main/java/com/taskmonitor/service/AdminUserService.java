package com.taskmonitor.service;

import java.util.List;

import com.taskmonitor.dto.dashboard.AdminDashboardDTO.UserSummaryDTO;
import com.taskmonitor.dto.dashboard.AdminUserUpdateDTO;

public interface AdminUserService {
    List<UserSummaryDTO> getAllUsers();
    void updateUser(Long id, AdminUserUpdateDTO dto);
    void deleteUser(Long id);
}
