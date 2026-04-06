package com.taskmonitor.dto.yearly;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class YearlyGoalResponseDTO {

    private Long id;
    private String title;
    private String description;
    private int year;
    private double progress;
    private String status;
}