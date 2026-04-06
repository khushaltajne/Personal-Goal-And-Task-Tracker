package com.taskmonitor.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.YearlyGoal;

public interface YearlyGoalRepository extends JpaRepository<YearlyGoal, Long>{
	List<YearlyGoal> findByUser(AppUser user);

	List<YearlyGoal> findByUserAndYear(AppUser user, int year);
}
