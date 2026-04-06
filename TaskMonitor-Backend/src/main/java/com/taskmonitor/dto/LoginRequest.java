package com.taskmonitor.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
		@NotBlank(message = "Email is Required")
		String email , 
		
		@NotBlank(message = "Password is required")
		String password) {

}
