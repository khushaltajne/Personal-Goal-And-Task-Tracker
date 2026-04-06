package com.taskmonitor.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.RefreshToken;
import com.taskmonitor.repository.RefreshTokenRepository;
import com.taskmonitor.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenServiceImpl
        implements RefreshTokenService {

    private final RefreshTokenRepository repository;

    private final long refreshDuration =
            7 * 24 * 60 * 60 * 1000; // 7 days

    @Override
    public RefreshToken createRefreshToken(AppUser user) {

        repository.deleteByUser(user); // rotation

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(
                        LocalDateTime.now()
                                .plusSeconds(refreshDuration / 1000)
                )
                .build();

        return repository.save(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            repository.delete(token);
            throw new RuntimeException("Refresh token expired");
        }
        return token;
    }

    @Override
    public void deleteByUser(AppUser user) {
        repository.deleteByUser(user);
    }
}
