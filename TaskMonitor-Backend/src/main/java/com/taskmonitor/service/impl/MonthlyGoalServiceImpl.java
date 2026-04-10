package com.taskmonitor.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmonitor.dto.monthly.MonthlyGoalRequestDTO;
import com.taskmonitor.dto.monthly.MonthlyGoalResponseDTO;
import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.MonthlyGoal;
import com.taskmonitor.entity.YearlyGoal;
import com.taskmonitor.exception.ResourceNotFoundException;
import com.taskmonitor.mapper.MonthlyGoalMapper;
import com.taskmonitor.repository.MonthlyGoalRepository;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.repository.YearlyGoalRepository;
import com.taskmonitor.service.MonthlyGoalService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MonthlyGoalServiceImpl implements MonthlyGoalService {

    private final MonthlyGoalMapper monthlyGoalMapper;
    private final MonthlyGoalRepository monthlyGoalRepository;
    private final YearlyGoalRepository yearlyGoalRepository;
    private final UserRepository userRepository;

    @Override
    public MonthlyGoalResponseDTO createMonthlyGoal(MonthlyGoalRequestDTO dto) {

        AppUser user = getLoggedUser();

        YearlyGoal yearlyGoal = null;
        if (dto.getYearlyGoalId() != null) {
            yearlyGoal = yearlyGoalRepository
                    .findById(dto.getYearlyGoalId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Yearly Goal Not Found"));

            if (!yearlyGoal.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Access Denied");
            }
        }

        MonthlyGoal monthlyGoal = MonthlyGoal.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .month(dto.getMonth())
                .targetValue(dto.getTargetValue())
                .currentValue(dto.getCurrentValue())
                .progress(0)
                        .user(user)
                        .yearlyGoal(yearlyGoal)  // null if not provided
                        .build();

        MonthlyGoal savedGoal = monthlyGoalRepository.save(monthlyGoal);

        return monthlyGoalMapper.toDTO(savedGoal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyGoalResponseDTO> getMonthlyGoals(Long yearlyGoalId) {

        AppUser user = getLoggedUser();

        return monthlyGoalRepository
                .findByYearlyGoalIdAndYearlyGoalUserId(
                        yearlyGoalId,
                        user.getId()
                )
                .stream()
                .map(monthlyGoalMapper::toDTO)
                .toList();
    }

    /**
     * Get all monthly goals of logged-in user (independent of YearlyGoal)
     */
    @Transactional(readOnly = true)
    public List<MonthlyGoalResponseDTO> getMonthlyGoals() {

        AppUser user = getLoggedUser();

        return monthlyGoalRepository
                .findByUserId(user.getId())
                .stream()
                .map(monthlyGoalMapper::toDTO)
                .toList();
    }
    
    @Override
    public MonthlyGoalResponseDTO updateMonthlyGoal(Long id, MonthlyGoalRequestDTO dto) {
        AppUser user = getLoggedUser();

        MonthlyGoal goal = monthlyGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Monthly Goal Not Found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access Denied");
        }

        if (dto.getTitle() != null) goal.setTitle(dto.getTitle());
        if (dto.getDescription() != null) goal.setDescription(dto.getDescription());
        if (dto.getMonth() != null) goal.setMonth(dto.getMonth());
        if (dto.getTargetValue() != 0) goal.setTargetValue(dto.getTargetValue());
        
        goal.setCurrentValue(dto.getCurrentValue());
        
        if (dto.getTargetValue() > 0 || goal.getTargetValue() > 0) {
            double target = dto.getTargetValue() > 0 ? dto.getTargetValue() : goal.getTargetValue();
            double progress = (goal.getCurrentValue() / target) * 100;
            goal.setProgress(progress > 100 ? 100 : progress); 
        }

        if (dto.getYearlyGoalId() != null) {
            YearlyGoal yearlyGoal = yearlyGoalRepository.findById(dto.getYearlyGoalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Yearly Goal Not Found"));
            if (!yearlyGoal.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Access Denied");
            }
            goal.setYearlyGoal(yearlyGoal);
        }

        MonthlyGoal savedGoal = monthlyGoalRepository.save(goal);
        return monthlyGoalMapper.toDTO(savedGoal);
    }

    @Override
    public void deleteMonthlyGoal(Long id) {
        AppUser user = getLoggedUser();
        MonthlyGoal goal = monthlyGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Monthly Goal Not Found"));
        
        if (goal.getUser().getId() != user.getId()) {
            throw new RuntimeException("Access Denied");
        }
        
        monthlyGoalRepository.delete(goal);
    }

    private AppUser getLoggedUser() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));
    }
}