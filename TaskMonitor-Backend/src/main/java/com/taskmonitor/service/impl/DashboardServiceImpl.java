package com.taskmonitor.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmonitor.dto.dashboard.AdminDashboardDTO;
import com.taskmonitor.dto.dashboard.AdminDashboardDTO.UserSummaryDTO;
import com.taskmonitor.dto.dashboard.DashboardStatsDTO;
import com.taskmonitor.entity.AppUser;
import com.taskmonitor.exception.ResourceNotFoundException;
import com.taskmonitor.repository.DailyTaskRepository;
import com.taskmonitor.repository.MonthlyGoalRepository;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.service.DashboardService;
import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final DailyTaskRepository dailyTaskRepository;
    private final MonthlyGoalRepository monthlyGoalRepository;
    private final UserRepository userRepository;

    private AppUser getLoggedUser() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));
    }

    @Override
    public DashboardStatsDTO getUserDashboard() {

        AppUser user = getLoggedUser();
        Long userId = user.getId();

        // 1️⃣ Status counts grouped
        List<Object[]> statusCounts =
                dailyTaskRepository.countTasksByStatusGrouped(userId);

        long todo = 0;
        long inProgress = 0;
        long completed = 0;

        for (Object[] row : statusCounts) {
            TaskStatus status = (TaskStatus) row[0];
            Long count = (Long) row[1];

            switch (status) {
                case TODO -> todo = count;
                case IN_PROGRESS -> inProgress = count;
                case COMPLETED -> completed = count;
            }
        }

        // 2️⃣ High priority
        long highPriority =
                dailyTaskRepository
                        .countByUserIdAndPriority(userId, TaskPriority.HIGH);

        // 3️⃣ Monthly progress
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();

        List<Object[]> monthlyData =
                dailyTaskRepository
                        .calculateMonthlyProgress(userId, month, year);

        double monthlyProgress = calculateProgress(monthlyData);

        // 4️⃣ Yearly progress
        List<Object[]> yearlyData =
                dailyTaskRepository
                        .calculateYearlyProgress(userId, year);

        double yearlyProgress = calculateProgress(yearlyData);

        return DashboardStatsDTO.builder()
                .todo(todo)
                .inProgress(inProgress)
                .completed(completed)
                .highPriority(highPriority)
                .monthlyProgress((long) monthlyProgress)
                .yearlyProgress((long) yearlyProgress)
                .build();
    }

    private double calculateProgress(List<Object[]> rows) {
        if (rows == null || rows.isEmpty())
            return 0;

        Object[] row = rows.get(0); // aggregate query always returns exactly 1 row

        if (row == null || row[0] == null)
            return 0;

        long total    = ((Number) row[0]).longValue();
        long completed = row[1] == null ? 0 : ((Number) row[1]).longValue();

        return total == 0 ? 0 : (completed * 100.0) / total;
    }

    @Override
    public AdminDashboardDTO getAdminDashboard() {

        Long totalUsers = userRepository.count();
        Long activeUsers = userRepository.countByEnabledTrue();
        Long totalTasks = dailyTaskRepository.count();
        Long totalGoals = monthlyGoalRepository.count();

        List<AppUser> users = userRepository.findAll();

        List<UserSummaryDTO> userSummaries = users.stream()
                .map(u -> UserSummaryDTO.builder()
                        .id(u.getId())
                        .username(u.getDisplayUsername())   // actual DB username, not email
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .enabled(u.isEnabled())
                        .build())
                .toList();

        return AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalTasks(totalTasks)
                .totalGoals(totalGoals)
                .allUsers(userSummaries)
                .build();
    }
}