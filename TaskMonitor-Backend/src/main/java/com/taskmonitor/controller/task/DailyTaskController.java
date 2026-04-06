package com.taskmonitor.controller.task;

import com.taskmonitor.dto.task.DailyTaskRequestDTO;
import com.taskmonitor.dto.task.DailyTaskResponseDTO;
import com.taskmonitor.service.DailyTaskService;
import com.taskmonitor.utility.PageResponse;
import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Validated
public class DailyTaskController {

    private final DailyTaskService service;

    @GetMapping
    public ResponseEntity<PageResponse<DailyTaskResponseDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        return ResponseEntity.ok(
                service.getAllTasks(
                        page, size, sortBy, direction,
                        status, priority, date, month, year
                )
        );
    }

    @PostMapping
    public ResponseEntity<DailyTaskResponseDTO> create(
            @Valid @RequestBody DailyTaskRequestDTO dto) {

        return ResponseEntity.ok(service.createTask(dto));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<DailyTaskResponseDTO> start(@PathVariable Long id) {
        return ResponseEntity.ok(service.startTask(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<DailyTaskResponseDTO> complete(@PathVariable Long id) {
        return ResponseEntity.ok(service.completeTask(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    
    
}