package com.taskmonitor.dto.task;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DailyTaskResponseDTO {

	private long id;
	private String title;
	private String description;
	private TaskPriority priority;
	private TaskStatus status;
	private LocalDate dueDate;
	private LocalDateTime createdAt;
}
