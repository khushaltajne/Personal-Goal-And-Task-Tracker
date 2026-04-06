package com.taskmonitor.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taskmonitor.dto.task.DailyTaskRequestDTO;
import com.taskmonitor.dto.task.DailyTaskResponseDTO;
import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.DailyTask;
import com.taskmonitor.entity.MonthlyGoal;
import com.taskmonitor.entity.YearlyGoal;
import com.taskmonitor.exception.ResourceNotFoundException;
import com.taskmonitor.mapper.DailyTaskMapper;
import com.taskmonitor.repository.DailyTaskRepository;
import com.taskmonitor.repository.MonthlyGoalRepository;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.service.DailyTaskService;
import com.taskmonitor.utility.PageResponse;
import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DailyTaskServiceImpl implements DailyTaskService {

    private final DailyTaskRepository dailyTaskRepository;
    private final MonthlyGoalRepository monthlyGoalRepository;
    private final UserRepository userRepository;
    private final DailyTaskMapper dailyTaskMapper;

    // =============================
    // 🔐 Logged User
    // =============================
    private AppUser getLoggedUser() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));
    }

    // =============================
    // ✅ CREATE
    // =============================
    @Override
    public DailyTaskResponseDTO createTask(DailyTaskRequestDTO dto) {

        AppUser user = getLoggedUser();

        MonthlyGoal monthlyGoal = null;
        if (dto.getMonthlyGoalId() != null) {
            monthlyGoal = monthlyGoalRepository
                    .findById(dto.getMonthlyGoalId())
                    .orElseThrow(() -> new RuntimeException("Monthly goal not found"));
        }

        DailyTask task = dailyTaskMapper.toEntity(dto, monthlyGoal, user);

        DailyTask saved = dailyTaskRepository.save(task);

        if (monthlyGoal != null) {
            updateMonthlyProgress(monthlyGoal);
        }

        return dailyTaskMapper.toDTO(saved);
    }

    // =============================
    // ✅ START TASK
    // =============================
    @Override
    public DailyTaskResponseDTO startTask(Long id) {

        DailyTask task = getTask(id);
        validateOwnership(task);

        if (task.getStatus() == TaskStatus.COMPLETED)
            throw new RuntimeException("Completed task cannot be modified");

        task.setStatus(TaskStatus.IN_PROGRESS);

        return dailyTaskMapper.toDTO(task);
    }

    // =============================
    // ✅ COMPLETE
    // =============================
    @Override
    public DailyTaskResponseDTO completeTask(long id) {

        DailyTask task = getTask(id);
        validateOwnership(task);

        if (task.getStatus() == TaskStatus.TODO)
            throw new RuntimeException("Task must be in progress");

        task.setStatus(TaskStatus.COMPLETED);

        if (task.getMonthlyGoal() != null) {
            updateMonthlyProgress(task.getMonthlyGoal());
        }

        return dailyTaskMapper.toDTO(task);
    }

    // =============================
    // ✅ DELETE
    // =============================
    @Override
    public void deleteTask(Long id) {

        DailyTask task = getTask(id);
        validateOwnership(task);

        MonthlyGoal monthlyGoal = task.getMonthlyGoal();

        dailyTaskRepository.delete(task);

        if (monthlyGoal != null) {
            updateMonthlyProgress(monthlyGoal);
        }
    }

    // =============================
    // ✅ GET ALL (WITH PAGINATION)
    // =============================
    @Override
    @Transactional(readOnly = true)
    public PageResponse<DailyTaskResponseDTO> getAllTasks(
            int page,
            int size,
            String sortBy,
            String direction,
            TaskStatus status,
            TaskPriority priority,
            LocalDate date,
            Integer month,
            Integer year) {

        AppUser user = getLoggedUser();

        Pageable pageable = PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending()
        );

        Page<DailyTask> taskPage =
                dailyTaskRepository.findByUser(user, pageable);

        List<DailyTaskResponseDTO> content = taskPage
                .map(dailyTaskMapper::toDTO)
                .getContent();

        return PageResponse.<DailyTaskResponseDTO>builder()
                .content(content)
                .pageNumber(taskPage.getNumber())
                .pageSize(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .last(taskPage.isLast())
                .build();
    }

    // =============================
    // 📊 COUNT
    // =============================
    @Override
    public long countByStatus(TaskStatus status) {

        AppUser user = getLoggedUser();
        return dailyTaskRepository.countByUserAndStatus(user, status);
    }

    // =============================
    // 🔁 PROGRESS UPDATE
    // =============================
    private void updateMonthlyProgress(MonthlyGoal monthlyGoal) {
        if (monthlyGoal == null) return;

        long total =
                dailyTaskRepository.countByMonthlyGoal(monthlyGoal);

        long completed =
                dailyTaskRepository
                        .countByMonthlyGoalAndStatus(
                                monthlyGoal,
                                TaskStatus.COMPLETED
                        );

        double progress =
                total == 0 ? 0 :
                        (completed * 100.0) / total;

        monthlyGoal.setProgress(progress);

        if (monthlyGoal.getYearlyGoal() != null) {
            updateYearlyProgress(monthlyGoal.getYearlyGoal());
        }
    }

    private void updateYearlyProgress(YearlyGoal yearlyGoal) {

        double avg = yearlyGoal.getMonthlyGoals()
                .stream()
                .mapToDouble(MonthlyGoal::getProgress)
                .average()
                .orElse(0);

        yearlyGoal.setProgress(avg);
    }

    // =============================
    // 🔐 VALIDATIONS
    // =============================
    private DailyTask getTask(Long id) {

        return dailyTaskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task Not Found"));
    }

    private void validateOwnership(DailyTask task) {

        AppUser user = getLoggedUser();

        if (!task.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Access Denied");
    }
}