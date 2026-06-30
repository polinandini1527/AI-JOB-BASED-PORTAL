package com.aijobportal.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.aijobportal.repository.JobRepository;
import com.aijobportal.repository.ApplicationRepository;

@Service
public class RecruiterService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public RecruiterService(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public Map<String, Object> getRecruiterStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        
        // Count applications that are shortlisted or selected
        long shortlisted = applicationRepository.findAll().stream()
                .filter(app -> "Shortlisted".equalsIgnoreCase(app.getStatus()) || "Selected".equalsIgnoreCase(app.getStatus()))
                .count();

        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("shortlistedCandidates", shortlisted);
        
        return stats;
    }
}
