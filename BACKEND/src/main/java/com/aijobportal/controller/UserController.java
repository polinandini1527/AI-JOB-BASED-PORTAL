package com.aijobportal.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aijobportal.dto.UserProfileResponse;
import com.aijobportal.model.User;
import com.aijobportal.service.UserService;
import com.aijobportal.exception.UserNotFoundException;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserProfileResponse profile(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return new UserProfileResponse(user.getName(), user.getEmail(), user.getSkills(), user.getResumeName());
    }

    @PostMapping("/profile/resume")
    public UserProfileResponse updateResume(@RequestParam String email, @RequestParam String resumeName) {
        User user = userService.updateUserResume(email, resumeName);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return new UserProfileResponse(user.getName(), user.getEmail(), user.getSkills(), user.getResumeName());
    }

    @PostMapping("/profile/upload")
    public ResponseEntity<?> uploadResumeFile(@RequestParam String email, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty!");
        }

        // Limit size to 5MB (5 * 1024 * 1024 bytes)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds maximum limit of 5MB!");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return ResponseEntity.badRequest().body("Invalid file name!");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!extension.equals("pdf") && !extension.equals("doc") && !extension.equals("docx")) {
            return ResponseEntity.badRequest().body("Only PDF, DOC, and DOCX files are allowed!");
        }

        try {
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            java.nio.file.Path filePath = uploadPath.resolve(originalFilename);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            User user = userService.updateUserResume(email, originalFilename);
            if (user == null) {
                throw new UserNotFoundException("User not found with email: " + email);
            }

            return ResponseEntity.ok(new UserProfileResponse(user.getName(), user.getEmail(), user.getSkills(), user.getResumeName()));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body("Error saving file: " + e.getMessage());
        }
    }

    @PostMapping("/profile/update")
    public UserProfileResponse updateProfile(@RequestParam String email, @RequestParam String name, @RequestParam String skills) {
        User user = userService.updateProfile(email, name, skills);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return new UserProfileResponse(user.getName(), user.getEmail(), user.getSkills(), user.getResumeName());
    }
}