package com.taskmonitor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Optional<RefreshToken> findByToken(String token);
	List<RefreshToken> findByUserAndRevokedFalse(AppUser user);
	void deleteByUser(AppUser user);
}
