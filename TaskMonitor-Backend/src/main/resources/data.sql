-- Insert test user
-- Password: password123 (hashed with BCrypt)
INSERT INTO app_user (username, email, password, role, enabled, email_verified)
VALUES (
    'testuser',
    'test@test.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
    'ROLE_USER',
    true,
    true
) ON CONFLICT (email) DO NOTHING;