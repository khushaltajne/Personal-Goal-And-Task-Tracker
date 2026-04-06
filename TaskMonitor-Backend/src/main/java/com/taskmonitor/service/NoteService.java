package com.taskmonitor.service;

import java.util.List;

import com.taskmonitor.dto.note.NoteRequestDTO;
import com.taskmonitor.dto.note.NoteResponseDTO;

public interface NoteService {

    NoteResponseDTO createNote(NoteRequestDTO requestDTO);
    
    List<NoteResponseDTO> getNotesByTaskId(Long taskId);
    
    List<NoteResponseDTO> getAllUserNotes();
    
    NoteResponseDTO updateNote(Long noteId, NoteRequestDTO requestDTO);
    
    void deleteNote(Long noteId);
}
