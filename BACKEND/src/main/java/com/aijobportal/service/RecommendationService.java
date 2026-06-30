package com.aijobportal.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.aijobportal.model.Job;
import com.aijobportal.repository.JobRepository;

@Service
public class RecommendationService {

    private final JobRepository jobRepository;

    public RecommendationService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public String recommendJobs(String skills) {
        if (skills == null || skills.trim().isEmpty()) {
            return "No Suitable Job Found";
        }
        
        List<Job> allJobs = jobRepository.findAll();
        String[] userSkills = skills.toLowerCase().split("[,\\s]+");
        
        Job bestJob = null;
        int bestScore = 0;
        
        for (Job job : allJobs) {
            int score = 0;
            String titleLower = job.getTitle().toLowerCase();
            String companyLower = job.getCompany().toLowerCase();
            for (String skill : userSkills) {
                skill = skill.trim();
                if (!skill.isEmpty() && (titleLower.contains(skill) || companyLower.contains(skill))) {
                    score++;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestJob = job;
            }
        }
        
        if (bestJob == null || bestScore == 0) {
            return "No Suitable Job Found";
        }
        
        int matchPercent = 75 + (bestScore * 10);
        if (matchPercent > 99) matchPercent = 99;
        
        return matchPercent + "% Match - " + bestJob.getTitle() + " at " + bestJob.getCompany();
    }
}