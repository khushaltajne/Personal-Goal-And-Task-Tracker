package com.taskmonitor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.MonthlyGoal;

public interface MonthlyGoalRepository 
        extends JpaRepository<MonthlyGoal, Long> {

    List<MonthlyGoal> findByYearlyGoalId(Long yearlyGoalId);
    
    List<MonthlyGoal> findByYearlyGoalIdAndYearlyGoalUserId(
            Long yearlyGoalId,
            Long userId
    );
    
    List<MonthlyGoal> findByIdAndYearlyGoalUserId(
            Long id,
            Long userId
    );

    // Fetch all goals for a user (via the direct user link)
    List<MonthlyGoal> findByUserId(Long userId);

    // Legacy: fetch goals via yearly goal's user
    List<MonthlyGoal> findByYearlyGoalUserId(Long id);
}