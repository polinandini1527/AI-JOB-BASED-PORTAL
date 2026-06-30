package com.aijobportal.controller;

import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aijobportal.dto.JobResponse;
import com.aijobportal.model.Job;
import com.aijobportal.service.JobService;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobResponse> getJobs() {
        return jobService.getAllJobs().stream()
                .map(job -> new JobResponse(job.getId(), job.getTitle(), job.getCompany(), job.getLocation()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public JobResponse postJob(@Valid @RequestBody Job job) {
        Job savedJob = jobService.saveJob(job);
        return new JobResponse(savedJob.getId(), savedJob.getTitle(), savedJob.getCompany(), savedJob.getLocation());
    }
}