package com.aijobportal.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aijobportal.service.RecruiterService;

@RestController
@CrossOrigin(origins = "*")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/recruiter/stats")
    public Map<String, Object> getStats() {
        return recruiterService.getRecruiterStats();
    }
}