package com.taskmonitor.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.taskmonitor.utility.TaskPriority;
import com.taskmonitor.utility.TaskStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "daily_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    private LocalDate dueDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monthly_goal_id", nullable = true)
    private MonthlyGoal monthlyGoal;
    
    @OneToMany(mappedBy = "task" , cascade = CascadeType.ALL 
    		,orphanRemoval = true)
    private List<Note> notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" ,nullable = false)
    private AppUser user;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public void addNote(Note note) {
        if (this.notes == null) {
            this.notes = new ArrayList<>();
        }
        this.notes.add(note);
        note.setTask(this);
    }
}