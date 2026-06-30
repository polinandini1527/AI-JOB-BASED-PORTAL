package com.aijobportal.dto;

public class ApplicationResponse {

    private int applicationId;
    private String userEmail;
    private String jobTitle;
    private String status;

    public ApplicationResponse() {}

    public ApplicationResponse(int applicationId, String userEmail, String jobTitle, String status) {
        this.applicationId = applicationId;
        this.userEmail = userEmail;
        this.jobTitle = jobTitle;
        this.status = status;
    }

    public int getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(int applicationId) {
        this.applicationId = applicationId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
