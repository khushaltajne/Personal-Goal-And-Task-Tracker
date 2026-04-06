package com.taskmonitor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmonitor.entity.AppUser;

public interface UserRepository extends JpaRepository<AppUser, Long> {
	Optional<AppUser> findByEmail(String email);
	
	Optional<AppUser> findByUsername(String email);

	boolean existsByUsername(String username);

	Long countByEnabledTrue();
}
