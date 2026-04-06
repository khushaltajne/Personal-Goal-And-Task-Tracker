package com.taskmonitor.mapper;

import org.springframework.stereotype.Component;
import com.taskmonitor.entity.Note;
import com.taskmonitor.dto.note.*;

@Component
public class NoteMapper {

    public Note toEntity(NoteRequestDTO dto) {
        return Note.builder()
                .content(dto.getContent())
                .build();
    }

    public NoteResponseDTO toDTO(Note note) {
        Long taskId = note.getTask() != null ? note.getTask().getId() : null;
        return NoteResponseDTO.builder()
                .id(note.getId())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .taskId(taskId)
                .build();
    }
}