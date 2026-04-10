package com.taskmonitor.service;

import java.util.List;

import com.taskmonitor.dto.monthly.MonthlyGoalRequestDTO;
import com.taskmonitor.dto.monthly.MonthlyGoalResponseDTO;

public interface MonthlyGoalService {
	 MonthlyGoalResponseDTO createMonthlyGoal(MonthlyGoalRequestDTO dto);

	    List<MonthlyGoalResponseDTO> getMonthlyGoals(Long yearlyGoalId);
	    
	    List<MonthlyGoalResponseDTO> getMonthlyGoals();
	    
	    MonthlyGoalResponseDTO updateMonthlyGoal(Long id, MonthlyGoalRequestDTO dto);
	    
	    void deleteMonthlyGoal(Long id);
}
