package com.aijobportal.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aijobportal.dto.RecommendationResponse;
import com.aijobportal.service.RecommendationService;

@RestController
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendations")
    public RecommendationResponse getRecommendations(@RequestParam String skills) {
        String rec = recommendationService.recommendJobs(skills);
        return new RecommendationResponse(rec);
    }
}