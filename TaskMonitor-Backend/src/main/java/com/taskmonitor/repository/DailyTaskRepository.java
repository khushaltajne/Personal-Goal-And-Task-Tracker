package com.taskmonitor.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.DailyTask;
import com.taskmonitor.entity.MonthlyGoal;
import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

public interface DailyTaskRepository extends JpaRepository<DailyTask, Long>,
        JpaSpecificationExecutor<DailyTask> {

    Page<DailyTask> findByStatus(TaskStatus status, Pageable pageable);

    Long countByStatus(TaskStatus status);

    Page<DailyTask> findByUser(AppUser user, Pageable pageable);

    long countByUserAndStatus(AppUser user, TaskStatus status);

    long countByUserAndPriority(AppUser user, TaskPriority priority);

    long countByUserIdAndPriority(Long userId, TaskPriority priority);

    long countByMonthlyGoal(MonthlyGoal monthlyGoal);

    long countByMonthlyGoalAndStatus(MonthlyGoal monthlyGoal, TaskStatus status);

    // ===============================
    // 🔥 GROUPED STATUS COUNT
    // ===============================
    @Query("""
           SELECT t.status, COUNT(t)
           FROM DailyTask t
           WHERE t.user.id = :userId
           GROUP BY t.status
           """)
    List<Object[]> countTasksByStatusGrouped(
            @Param("userId") Long userId
    );

    // ===============================
    // 🔥 MONTHLY PROGRESS
    // ===============================
    @Query("""
           SELECT 
               COUNT(t),
               SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END)
           FROM DailyTask t
           WHERE t.user.id = :userId
             AND t.monthlyGoal.month = :month
             AND t.monthlyGoal.yearlyGoal.year = :year
           """)
    List<Object[]> calculateMonthlyProgress(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year
    );

    // ===============================
    // 🔥 YEARLY PROGRESS
    // ===============================
    @Query("""
           SELECT 
               COUNT(t),
               SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END)
           FROM DailyTask t
           WHERE t.user.id = :userId
             AND t.monthlyGoal.yearlyGoal.year = :year
           """)
    List<Object[]> calculateYearlyProgress(
            @Param("userId") Long userId,
            @Param("year") int year
    );
}