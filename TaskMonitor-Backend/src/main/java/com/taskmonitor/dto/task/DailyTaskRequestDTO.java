package com.taskmonitor.dto.task;

import java.time.LocalDate;

import com.taskmonitor.utility.TaskPriority;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyTaskRequestDTO {

    @NotBlank(message = "Title is mandatory")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Priority is mandatory")
    private TaskPriority priority;

    @FutureOrPresent(message = "Due date must be today or future")
    private LocalDate dueDate;
    
    // Optional — task can exist independently of any monthly goal
    private Long monthlyGoalId;
}