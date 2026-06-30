package com.aijobportal.controller;

import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aijobportal.dto.ApplicationResponse;
import com.aijobportal.model.Application;
import com.aijobportal.service.ApplicationService;

@RestController
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/applications")
    public ApplicationResponse applyJob(@Valid @RequestBody Application application) {
        Application result = applicationService.applyJob(application);
        return new ApplicationResponse(result.getApplicationId(), result.getUserEmail(), result.getJobTitle(), result.getStatus());
    }

    @GetMapping("/applications")
    public List<ApplicationResponse> getApplications(@RequestParam String email) {
        return applicationService.getApplicationsByUser(email).stream()
                .map(app -> new ApplicationResponse(app.getApplicationId(), app.getUserEmail(), app.getJobTitle(), app.getStatus()))
                .collect(Collectors.toList());
    }
}
