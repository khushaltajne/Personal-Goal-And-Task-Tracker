package com.taskmonitor.mapper;

import org.springframework.stereotype.Component;
import com.taskmonitor.entity.YearlyGoal;
import com.taskmonitor.dto.yearly.*;

@Component
public class YearlyGoalMapper {

    public YearlyGoal toEntity(YearlyGoalRequestDTO dto) {
        return YearlyGoal.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .year(dto.getYear())
                .progress(0)
                .status(dto.getStatus() != null ? dto.getStatus() : "Active")
                .build();
    }

    public YearlyGoalResponseDTO toDTO(YearlyGoal goal) {
        return YearlyGoalResponseDTO.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .year(goal.getYear())
                .progress(goal.getProgress())
                .status(goal.getStatus())
                .build();
    }
}