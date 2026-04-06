package com.taskmonitor.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmonitor.dto.note.NoteRequestDTO;
import com.taskmonitor.dto.note.NoteResponseDTO;
import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.DailyTask;
import com.taskmonitor.entity.Note;
import com.taskmonitor.exception.ResourceNotFoundException;
import com.taskmonitor.mapper.NoteMapper;
import com.taskmonitor.repository.DailyTaskRepository;
import com.taskmonitor.repository.NoteRepository;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.service.NoteService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final DailyTaskRepository dailyTaskRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    private AppUser getLoggedUser() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));
    }

    @Override
    public NoteResponseDTO createNote(NoteRequestDTO requestDTO) {
        AppUser user = getLoggedUser();
        
        Note note = noteMapper.toEntity(requestDTO);
        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        
        if (requestDTO.getTaskId() != null) {
            DailyTask task = dailyTaskRepository.findById(requestDTO.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
            // Verify task belongs to user
            if (!task.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to add note to this task");
            }
            note.setTask(task);
        }
        
        Note savedNote = noteRepository.save(note);
        return noteMapper.toDTO(savedNote);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponseDTO> getNotesByTaskId(Long taskId) {
        AppUser user = getLoggedUser();
        List<Note> notes = noteRepository.findByTask_IdAndUser_Id(taskId, user.getId());
        return notes.stream().map(noteMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponseDTO> getAllUserNotes() {
        AppUser user = getLoggedUser();
        List<Note> notes = noteRepository.findByUser_Id(user.getId());
        return notes.stream().map(noteMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public NoteResponseDTO updateNote(Long noteId, NoteRequestDTO requestDTO) {
        AppUser user = getLoggedUser();
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
                
        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to edit this note");
        }
        
        // Update content if provided
        if (requestDTO.getContent() != null) {
            note.setContent(requestDTO.getContent());
        }
        
        // Update tasklink
        if (requestDTO.getTaskId() != null) {
            DailyTask task = dailyTaskRepository.findById(requestDTO.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
            if (!task.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to link note to this task");
            }
            note.setTask(task);
        } else {
            note.setTask(null); // Remove task link if explicitly sent as null
        }
        
        Note updatedNote = noteRepository.save(note);
        return noteMapper.toDTO(updatedNote);
    }

    @Override
    public void deleteNote(Long noteId) {
        AppUser user = getLoggedUser();
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
                
        if (!note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this note");
        }
        
        noteRepository.delete(note);
    }
}
