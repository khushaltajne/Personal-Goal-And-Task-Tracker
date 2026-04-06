package com.taskmonitor.mapper;

import org.springframework.stereotype.Component;
import com.taskmonitor.entity.MonthlyGoal;
import com.taskmonitor.dto.monthly.*;

@Component
public class MonthlyGoalMapper {

    public MonthlyGoal toEntity(MonthlyGoalRequestDTO dto) {
        return MonthlyGoal.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .month(dto.getMonth())
                .targetValue(dto.getTargetValue())
                .currentValue(dto.getCurrentValue())
                .progress(0)
                .build();
    }

    public MonthlyGoalResponseDTO toDTO(MonthlyGoal entity) {
        return MonthlyGoalResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .month(entity.getMonth())
                .targetValue(entity.getTargetValue())
                .currentValue(entity.getCurrentValue())
                .progress(entity.getProgress())
                .build();
    }
}