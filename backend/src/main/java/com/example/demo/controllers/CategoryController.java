package com.example.demo.controllers;
import com.example.demo.models.Note;
import com.example.demo.repositories.NoteRepository;
import com.example.demo.models.Category;
import com.example.demo.repositories.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Optional;
import org.springframework.http.HttpStatus; 


import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final NoteRepository noteRepository;

    public CategoryController(CategoryRepository categoryRepository, NoteRepository noteRepository) {
        this.categoryRepository = categoryRepository;
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
public ResponseEntity<?> createCategory(@Valid @RequestBody Category category) {
    System.out.println("Category received: " + category.getName());
    Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
    if (existingCategory.isPresent()) {
        return ResponseEntity.badRequest().body("Category already exists");
    }

    Category newCategory = categoryRepository.save(category);
    return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
    Optional<Category> categoryToDelete = categoryRepository.findById(id);

    if (categoryToDelete.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Category uncategorizedCategory = categoryRepository
            .findByName("Uncategorized")
            .orElseGet(() -> {
                Category newCategory = new Category();
                newCategory.setName("Uncategorized");
                return categoryRepository.save(newCategory);
            });

    List<Note> notes = noteRepository.findAll();
    for (Note note : notes) {
        if (note.getCategories().contains(categoryToDelete.get())) {
            note.getCategories().remove(categoryToDelete.get());
            if (note.getCategories().isEmpty()) {
                note.getCategories().add(uncategorizedCategory);
            }

            noteRepository.save(note); 
        }
    }

    categoryRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}
}