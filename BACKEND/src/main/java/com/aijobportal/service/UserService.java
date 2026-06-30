package com.aijobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aijobportal.model.User;
import com.aijobportal.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUserResume(String email, String resumeName) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setResumeName(resumeName);
            return userRepository.save(user);
        }
        return null;
    }

    public User updateProfile(String email, String name, String skills) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setName(name);
            user.setSkills(skills);
            return userRepository.save(user);
        }
        return null;
    }
}