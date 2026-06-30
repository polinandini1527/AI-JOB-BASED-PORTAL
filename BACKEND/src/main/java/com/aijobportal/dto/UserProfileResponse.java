package com.aijobportal.dto;

public class UserProfileResponse {

    private String name;
    private String email;
    private String skills;
    private String resumeName;

    public UserProfileResponse() {}

    public UserProfileResponse(String name, String email, String skills, String resumeName) {
        this.name = name;
        this.email = email;
        this.skills = skills;
        this.resumeName = resumeName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }
}
