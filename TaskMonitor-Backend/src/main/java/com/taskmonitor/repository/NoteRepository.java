package com.taskmonitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmonitor.entity.Note;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long>{

    List<Note> findByUser_Id(Long userId);
    
    List<Note> findByTask_IdAndUser_Id(Long taskId, Long userId);
}
