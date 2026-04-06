package com.taskmonitor.service;

import java.util.List;

import com.taskmonitor.dto.yearly.YearlyGoalRequestDTO;
import com.taskmonitor.dto.yearly.YearlyGoalResponseDTO;

public interface YearlyGoalService {

	YearlyGoalResponseDTO createYearlyGoal(YearlyGoalRequestDTO dto);

    List<YearlyGoalResponseDTO> getMyYearlyGoals(Integer year);

    void deleteYearlyGoal(Long id);
}
