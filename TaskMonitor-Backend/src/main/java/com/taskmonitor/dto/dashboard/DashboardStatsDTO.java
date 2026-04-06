package com.taskmonitor.dto.dashboard;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DashboardStatsDTO {

    private long yearlyProgress;
    private long monthlyProgress;
    private long todo;
    private long inProgress;
    private long completed;
    private long highPriority;
}