package com.aijobportal.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.aijobportal.repository.UserRepository;
import com.aijobportal.repository.JobRepository;
import com.aijobportal.repository.ApplicationRepository;
import com.aijobportal.repository.RecruiterRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final RecruiterRepository recruiterRepository;

    public AdminService(UserRepository userRepository,
                        JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        RecruiterRepository recruiterRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.recruiterRepository = recruiterRepository;
    }

    public Map<String, Long> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalRecruiters", recruiterRepository.count());
        return stats;
    }
}
