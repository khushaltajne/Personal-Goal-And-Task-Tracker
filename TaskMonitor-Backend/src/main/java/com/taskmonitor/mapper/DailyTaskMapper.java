package com.taskmonitor.mapper;

import org.springframework.stereotype.Component;
import com.taskmonitor.entity.*;
import com.taskmonitor.dto.task.*;
import com.taskmonitor.utility.TaskStatus;

@Component
public class DailyTaskMapper {

    public DailyTask toEntity(
            DailyTaskRequestDTO dto,
            MonthlyGoal monthlyGoal,
            AppUser user) {

        return DailyTask.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .dueDate(dto.getDueDate())
                .status(TaskStatus.TODO)
                .monthlyGoal(monthlyGoal)
                .user(user)
                .build();
    }

    public DailyTaskResponseDTO toDTO(DailyTask entity) {
        return DailyTaskResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .dueDate(entity.getDueDate())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}