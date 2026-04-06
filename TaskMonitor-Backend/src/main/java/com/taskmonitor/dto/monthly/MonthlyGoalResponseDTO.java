package com.taskmonitor.dto.monthly;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyGoalResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String month;
    private double targetValue;
    private double currentValue;
    private double progress;
}