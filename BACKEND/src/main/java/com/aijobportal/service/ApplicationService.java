package com.aijobportal.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.aijobportal.model.Application;
import com.aijobportal.repository.ApplicationRepository;

import com.aijobportal.exception.DuplicateApplicationException;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application applyJob(Application application) {
        List<Application> existingApps = applicationRepository.findByUserEmail(application.getUserEmail());
        if (existingApps != null) {
            for (Application app : existingApps) {
                if (app.getJobTitle().equalsIgnoreCase(application.getJobTitle())) {
                    throw new DuplicateApplicationException("You have already applied for this job!");
                }
            }
        }
        if (application.getStatus() == null || application.getStatus().isEmpty()) {
            application.setStatus("Applied");
        }
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByUser(String email) {
        return applicationRepository.findByUserEmail(email);
    }
}
