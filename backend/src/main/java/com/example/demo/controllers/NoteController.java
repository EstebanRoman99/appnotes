package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import com.example.demo.models.Note;
import com.example.demo.models.Category;
import com.example.demo.repositories.NoteRepository;
import com.example.demo.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")

public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Note> getNotesByCategories(@RequestParam(required = false) List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return noteRepository.findAll();
        }
        return noteRepository.findByCategories_NameIn(categories);
    }


    @PostMapping(
    consumes = { MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8" },
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Note> createNote(@Valid @RequestBody Note note) {
    try {
        Set<Category> categories = note.getCategories().stream()
                .map(category -> categoryRepository.findById(category.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found")))
                .collect(Collectors.toSet());
        note.setCategories(categories);

        Note savedNote = noteRepository.save(note);
        return ResponseEntity.ok(savedNote);
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}

@PutMapping("/{id}")
public ResponseEntity<?> updateNote(@PathVariable Long id, @Valid @RequestBody Note updatedNote) {
    return noteRepository.findById(id)
            .map(note -> {
                note.setTitle(updatedNote.getTitle());
                note.setDescription(updatedNote.getDescription());
                note.setArchived(updatedNote.isArchived());

                // Update 
                Set<Category> categories = updatedNote.getCategories().stream()
                        .map(category -> categoryRepository.findById(category.getId())
                                .orElseThrow(() -> new RuntimeException("Category not found with id: " + category.getId())))
                        .collect(Collectors.toSet());

                note.setCategories(categories);

                Note savedNote = noteRepository.save(note);
                return ResponseEntity.ok(savedNote);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
}

    @PatchMapping("/{id}")
    public ResponseEntity<Note> updatePartialNote(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<Note> optionalNote = noteRepository.findById(id);

        if (optionalNote.isPresent()) {
            Note noteToUpdate = optionalNote.get();

            if (updates.containsKey("title")) {
                noteToUpdate.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("description")) {
                noteToUpdate.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("archived")) {
                noteToUpdate.setArchived((Boolean) updates.get("archived"));
            }
            if (updates.containsKey("categories")) {
                @SuppressWarnings("unchecked")
                List<Map<String, String>> updatedCategories = (List<Map<String, String>>) updates.get("categories");
                Set<Category> categories = updatedCategories.stream()
                        .map(categoryData -> categoryRepository.findByName(categoryData.get("name"))
                                .orElseGet(() -> categoryRepository.save(new Category(categoryData.get("name")))))
                        .collect(Collectors.toSet());
                noteToUpdate.setCategories(categories);
            }

            Note updatedNote = noteRepository.save(noteToUpdate);
            return ResponseEntity.ok(updatedNote);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
        return "Note deleted successfully";
    }
}