package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.demo.models.Category;
import com.example.demo.repositories.CategoryRepository;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
    @Bean
    CommandLineRunner initializeCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.findByName("Uncategorized").isEmpty()) {
                Category defaultCategory = new Category();
                defaultCategory.setName("Uncategorized");
                categoryRepository.save(defaultCategory);
                System.out.println("Default category 'Uncategorized' created.");
            }
        };
    }
}