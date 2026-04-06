package com.taskmonitor.specification;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import org.springframework.data.jpa.domain.Specification;
import com.taskmonitor.entity.DailyTask;
import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

public class TaskSpecification {
	
	public static Specification<DailyTask> hasStatus(TaskStatus status){
		return (root , query , cb) -> 
		status == null ? null :
			cb.equal(root.get("status"), status);
	}
	
	public static Specification<DailyTask> hasPriority(TaskPriority priority){
		return (root , query , cb) -> 
		priority == null ? null :
			cb.equal(root.get("priority"), priority);
	}
	
	public static Specification<DailyTask> hasSpecificDate(LocalDate date){
		return (root , query , cb) -> 
		date == null ? null :
			cb.equal(root.get("dueDate"), date);
	}
	
	public static Specification<DailyTask> hasMonthAndYear(Integer month , Integer year){
		if(month == null || year == null ) return null;
		
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = start.with(TemporalAdjusters.lastDayOfMonth());
		
		return (root , query , cb) -> 
			cb.between(root.get("dueDate"), start ,end);
	}
	
	public static Specification<DailyTask> hasYear(Integer year){
		if(year==null) return null;
		
		LocalDate start = LocalDate.of(year, 1, 1);
		LocalDate end = LocalDate.of(year, 12, 31);
		
		return (root , query , cb) -> 
		cb.between(root.get("dueDate"), start ,end);
	}
}
