package com.taskmonitor.dto.note;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteRequestDTO {

    private String content;
    private Long taskId;
} 