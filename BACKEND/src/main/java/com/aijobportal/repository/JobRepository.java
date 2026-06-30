package com.aijobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.aijobportal.model.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
}