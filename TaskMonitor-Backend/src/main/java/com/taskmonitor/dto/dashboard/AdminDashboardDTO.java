package com.taskmonitor.dto.dashboard;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AdminDashboardDTO {

    private Long totalUsers;
    private Long activeUsers;
    private Long totalTasks;
    private Long totalGoals;
    private List<UserSummaryDTO> allUsers;

    @Builder
    @Getter
    public static class UserSummaryDTO {
        private Long id;
        private String username;
        private String email;
        private String role;
        private boolean enabled;
    }
}
