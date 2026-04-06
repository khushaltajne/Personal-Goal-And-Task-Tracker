package com.taskmonitor.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmonitor.dto.dashboard.DashboardStatsDTO;
import com.taskmonitor.service.impl.DashboardServiceImpl;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/dashboard")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserDashboardController {

    private final DashboardServiceImpl dashboardService;

    @GetMapping
    public ResponseEntity<DashboardStatsDTO> getUserDashboard() {
        return ResponseEntity.ok(dashboardService.getUserDashboard());
    }
}

