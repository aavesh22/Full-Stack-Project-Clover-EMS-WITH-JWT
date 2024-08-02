package com.ems.cloverems.service;

import java.util.HashSet;
import java.util.Set;
import org.springframework.stereotype.Service;
@Service
public class TokenBlacklistService {
    private Set<String> blacklistedTokens = new HashSet<>();

    public void addToBlacklist(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    // Optionally, you can add a method to clean up expired tokens from the blacklist
}