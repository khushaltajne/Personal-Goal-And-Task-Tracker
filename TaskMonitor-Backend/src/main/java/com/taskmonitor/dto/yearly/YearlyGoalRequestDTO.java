package com.taskmonitor.dto.yearly;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearlyGoalRequestDTO {

    private String title;
    private String description;
    private int year;
    private String status;
}