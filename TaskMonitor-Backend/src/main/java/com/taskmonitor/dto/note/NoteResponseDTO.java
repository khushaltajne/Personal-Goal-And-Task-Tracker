package com.taskmonitor.dto.note;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NoteResponseDTO {

    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long taskId;
}