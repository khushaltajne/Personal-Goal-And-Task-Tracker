package com.taskmonitor.config;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.repository.UserRepository;
import com.taskmonitor.utility.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create test user for real-time testing
        if (userRepository.count() == 0) {
            AppUser testUser = AppUser.builder()
                    .username("test@example.com")
                    .email("test@example.com")
                    .password(passwordEncoder.encode("test123"))
                    .role(Role.ROLE_USER)
                    .enabled(true)
                    .emailVerified(true)
                    .build();

            userRepository.save(testUser);
            System.out.println("✅ Test user created for real-time testing:");
            System.out.println("   Email: test@example.com");
            System.out.println("   Password: test123");
            System.out.println("   Use these credentials in your frontend login");
        } else {
            System.out.println("ℹ️  Users already exist in database - using existing data");
            // Show existing users
            userRepository.findAll().forEach(user -> {
                System.out.println("   Existing user: " + user.getEmail());
            });
        }
    }
}