package com.taskmonitor.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmonitor.dto.yearly.YearlyGoalRequestDTO;
import com.taskmonitor.dto.yearly.YearlyGoalResponseDTO;
import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.YearlyGoal;
import com.taskmonitor.exception.ResourceNotFoundException;
import com.taskmonitor.mapper.YearlyGoalMapper;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.repository.YearlyGoalRepository;
import com.taskmonitor.service.YearlyGoalService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class YearlyGoalServiceImpl implements YearlyGoalService {

	private final YearlyGoalMapper yearlyGoalMapper;
    private final YearlyGoalRepository yearlyGoalRepository;
    private final UserRepository userRepository;

    private AppUser getLoggedUser() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
    }

    @Override
    public YearlyGoalResponseDTO createYearlyGoal(YearlyGoalRequestDTO dto) {

        AppUser user = getLoggedUser();

        YearlyGoal goal = YearlyGoal.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .year(dto.getYear())
                .progress(0)
                .status(dto.getStatus() != null ? dto.getStatus() : "Active")
                .user(user)
                .build();

        return map(yearlyGoalRepository.save(goal));
    }

    @Override
    @Transactional(readOnly = true)
    public List<YearlyGoalResponseDTO> getMyYearlyGoals(Integer year) {

        AppUser user = getLoggedUser();

        if (year != null) {
            return yearlyGoalRepository
                    .findByUserAndYear(user, year)
                    .stream()
                    .map(yearlyGoalMapper::toDTO)
                    .toList();
        } else {
            return yearlyGoalRepository
                    .findByUser(user)
                    .stream()
                    .map(yearlyGoalMapper::toDTO)
                    .toList();
        }
    }

    @Override
    public void deleteYearlyGoal(Long id) {

        AppUser user = getLoggedUser();

        YearlyGoal goal = yearlyGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yearly Goal Not Found"));

        if (!goal.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Access Denied");

        yearlyGoalRepository.delete(goal);
    }

    private YearlyGoalResponseDTO map(YearlyGoal goal) {
    	return yearlyGoalMapper.toDTO(goal);
    }
}