package com.aijobportal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.aijobportal.model.Application;
import com.aijobportal.model.Job;
import com.aijobportal.model.Recruiter;
import com.aijobportal.model.User;
import com.aijobportal.repository.ApplicationRepository;
import com.aijobportal.repository.JobRepository;
import com.aijobportal.repository.RecruiterRepository;
import com.aijobportal.repository.UserRepository;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class AIJobPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(
            AIJobPortalApplication.class,
            args
        );
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            JobRepository jobRepository,
            RecruiterRepository recruiterRepository,
            ApplicationRepository applicationRepository,
            BCryptPasswordEncoder encoder) {
        return args -> {
            boolean seeded = false;
            
            if (userRepository.count() == 0) {
                userRepository.save(new User(0, "Candidate", "candidate@jobportal.com", encoder.encode("password"), "Java, Spring Boot"));
                userRepository.save(new User(0, "Recruiter User", "recruiter@jobportal.com", encoder.encode("password"), ""));
                userRepository.save(new User(0, "Admin User", "admin@jobportal.com", encoder.encode("password"), ""));
                seeded = true;
            }
            
            if (recruiterRepository.count() == 0) {
                recruiterRepository.save(new Recruiter(0, "Infosys", "recruiter@jobportal.com"));
                seeded = true;
            }
            
            if (jobRepository.count() == 0) {
                jobRepository.save(new Job("Java Full Stack Developer", "Infosys", "Hyderabad"));
                jobRepository.save(new Job("Software Engineer", "TCS", "Bangalore"));
                jobRepository.save(new Job("Backend Developer", "Wipro", "Chennai"));
                jobRepository.save(new Job("Frontend Developer", "Accenture", "Pune"));
                jobRepository.save(new Job("Python Developer", "Cognizant", "Bangalore"));
                jobRepository.save(new Job("DevOps Engineer", "HCL", "Noida"));
                seeded = true;
            }
            
            if (applicationRepository.count() == 0) {
                applicationRepository.save(new Application(0, "candidate@jobportal.com", "Java Full Stack Developer", "Applied"));
                applicationRepository.save(new Application(0, "candidate@jobportal.com", "Software Engineer", "Shortlisted"));
                seeded = true;
            }

            if (seeded) {
                System.out.println("Seeding completed successfully.");
            } else {
                System.out.println("Database already initialized.");
            }
        };
    }
}