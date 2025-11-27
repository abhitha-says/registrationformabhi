-- Registration Form Database Schema
-- MySQL/MariaDB
-- Import this file to set up your database

-- Create Database
CREATE DATABASE IF NOT EXISTS registration_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE registration_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'User ID',
    full_name VARCHAR(100) NOT NULL COMMENT 'Full name of user',
    email VARCHAR(254) UNIQUE NOT NULL COMMENT 'User email (unique)',
    phone VARCHAR(20) NOT NULL COMMENT 'User phone number',
    password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
    ip_address VARCHAR(45) COMMENT 'IP address of registration',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User registration table';

-- Create Activity Log Table (Optional)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Log ID',
    user_id INT COMMENT 'Related user ID',
    action VARCHAR(50) NOT NULL COMMENT 'Action performed',
    details TEXT COMMENT 'Action details',
    ip_address VARCHAR(45) COMMENT 'IP address',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Log timestamp',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Activity log for user actions';

-- Sample Insert Query
-- INSERT INTO users (full_name, email, phone, password, ip_address) 
-- VALUES ('John Doe', 'john@example.com', '+1234567890', '$2y$12$...', '192.168.1.1');
