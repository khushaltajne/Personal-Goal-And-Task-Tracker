package com.taskmonitor.service;


import java.time.LocalDate;
import org.springframework.data.domain.Page;

import com.taskmonitor.dto.dashboard.DashboardStatsDTO;
import com.taskmonitor.dto.task.DailyTaskRequestDTO;
import com.taskmonitor.dto.task.DailyTaskResponseDTO;
import com.taskmonitor.utility.PageResponse;
import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

public interface DailyTaskService {
	
	DailyTaskResponseDTO createTask(DailyTaskRequestDTO dto);
	
	DailyTaskResponseDTO completeTask(long id);

	DailyTaskResponseDTO startTask(Long id);

	public PageResponse<DailyTaskResponseDTO> getAllTasks(
	        int page,
	        int size,
	        String sortBy,
	        String direction,
	        TaskStatus status,
	        TaskPriority priority,
	        LocalDate date,
	        Integer month,
	        Integer year);
	
	long countByStatus(TaskStatus todo);

	void deleteTask(Long id);

}
