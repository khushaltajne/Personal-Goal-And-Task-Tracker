package com.taskmonitor.controller.yearly;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmonitor.dto.yearly.YearlyGoalRequestDTO;
import com.taskmonitor.dto.yearly.YearlyGoalResponseDTO;
import com.taskmonitor.service.YearlyGoalService;

import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/yearly-goals")
@RequiredArgsConstructor
public class YearlyGoalController {

    private final YearlyGoalService yearlyGoalService;

    @PostMapping
    public ResponseEntity<YearlyGoalResponseDTO> create(
            @RequestBody YearlyGoalRequestDTO dto) {

        return ResponseEntity.ok(
                yearlyGoalService.createYearlyGoal(dto));
    }

    @GetMapping
    public ResponseEntity<List<YearlyGoalResponseDTO>> getByYear(
            @RequestParam(required = false) Integer year) {

        return ResponseEntity.ok(
                yearlyGoalService.getMyYearlyGoals(year));
    }

    @PutMapping("/{id}")
    public ResponseEntity<YearlyGoalResponseDTO> update(
            @PathVariable Long id,
            @RequestBody YearlyGoalRequestDTO dto) {

        return ResponseEntity.ok(
                yearlyGoalService.updateYearlyGoal(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        yearlyGoalService.deleteYearlyGoal(id);
        return ResponseEntity.noContent().build();
    }
}
