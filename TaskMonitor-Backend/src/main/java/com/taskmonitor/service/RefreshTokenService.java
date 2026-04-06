package com.taskmonitor.service;

import com.taskmonitor.entity.AppUser;
import com.taskmonitor.entity.RefreshToken;

public interface RefreshTokenService {

	 RefreshToken createRefreshToken(AppUser user);

	    RefreshToken verifyExpiration(RefreshToken token);

	    void deleteByUser(AppUser user);
}
