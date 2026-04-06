package com.taskmonitor.controller.note;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmonitor.dto.note.NoteRequestDTO;
import com.taskmonitor.dto.note.NoteResponseDTO;
import com.taskmonitor.service.NoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteResponseDTO> createNote(@RequestBody NoteRequestDTO requestDTO) {
        return new ResponseEntity<>(noteService.createNote(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<NoteResponseDTO>> getAllUserNotes() {
        return ResponseEntity.ok(noteService.getAllUserNotes());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<NoteResponseDTO>> getNotesByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(noteService.getNotesByTaskId(taskId));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<NoteResponseDTO> updateNote(
            @PathVariable Long id, 
            @RequestBody NoteRequestDTO requestDTO) {
        return ResponseEntity.ok(noteService.updateNote(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}
