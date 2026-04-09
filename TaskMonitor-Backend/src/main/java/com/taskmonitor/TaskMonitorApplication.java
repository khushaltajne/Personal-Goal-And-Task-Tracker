package com.taskmonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class TaskMonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskMonitorApplication.class, args);
	}

	@Bean
	public CommandLineRunner databaseMigration(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE note ALTER COLUMN content TYPE TEXT");
				System.out.println("✅ SUCCESSFULLY MIGRATED 'note.content' COLUMN TO TEXT TYPE!");
			} catch (Exception e) {
				System.out.println("⚠️ MIGRATION NOT NEEDED OR FAILED: " + e.getMessage());
			}
		};
	}

}
