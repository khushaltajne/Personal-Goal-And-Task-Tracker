package com.taskmonitor.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyGoal {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String title;
	private String description;
	private String month;
	
	private double targetValue;
	private double currentValue;
	private double progress;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "yearly_goal_id", nullable = true)
	private YearlyGoal yearlyGoal;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private AppUser user;
	
	@OneToMany(mappedBy = "monthlyGoal", cascade = CascadeType.ALL)
	private List<DailyTask> dailyTasks;
}

