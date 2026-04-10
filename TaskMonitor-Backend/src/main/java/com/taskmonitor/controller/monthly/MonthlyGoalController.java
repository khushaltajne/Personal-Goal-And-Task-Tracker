package com.taskmonitor.controller.monthly;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskmonitor.dto.monthly.MonthlyGoalRequestDTO;
import com.taskmonitor.dto.monthly.MonthlyGoalResponseDTO;
import com.taskmonitor.service.MonthlyGoalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/monthly-goals")
@RequiredArgsConstructor
public class MonthlyGoalController {

    private final MonthlyGoalService monthlyGoalService;

    @PostMapping
    public ResponseEntity<MonthlyGoalResponseDTO> create(
            @RequestBody MonthlyGoalRequestDTO dto) {

        return ResponseEntity.ok(
                monthlyGoalService.createMonthlyGoal(dto)
        );
    }

    @GetMapping
    public ResponseEntity<List<MonthlyGoalResponseDTO>> getMonthlyGoals() {
        return ResponseEntity.ok(
                monthlyGoalService.getMonthlyGoals()
        );
    }

    @GetMapping("/yearly-goal/{yearlyGoalId}")
    public ResponseEntity<List<MonthlyGoalResponseDTO>> getMonthlyGoalsByYearlyGoal(
            @PathVariable Long yearlyGoalId) {

        return ResponseEntity.ok(
                monthlyGoalService.getMonthlyGoals(yearlyGoalId)
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MonthlyGoalResponseDTO> update(
            @PathVariable Long id,
            @RequestBody MonthlyGoalRequestDTO dto) {

        return ResponseEntity.ok(
                monthlyGoalService.updateMonthlyGoal(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        monthlyGoalService.deleteMonthlyGoal(id);
        return ResponseEntity.noContent().build();
    }
}