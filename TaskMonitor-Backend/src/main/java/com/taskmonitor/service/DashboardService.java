package com.taskmonitor.service;

import com.taskmonitor.dto.dashboard.AdminDashboardDTO;
import com.taskmonitor.dto.dashboard.DashboardStatsDTO;

public interface DashboardService {
	AdminDashboardDTO getAdminDashboard();
	
	DashboardStatsDTO getUserDashboard();
	
}
