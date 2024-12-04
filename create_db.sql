# Create database script for Geobolt

# Create the database
CREATE DATABASE Geobolt_db;
USE Geobolt_db;

# Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    PRIMARY KEY(id)
);

# Create the landmarks table
CREATE TABLE landmarks (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT,
    location VARCHAR(255),
    PRIMARY KEY(id)
);

# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON Geobolt_db.* TO 'appuser'@'localhost';

# Flush privileges to ensure that all changes take effect
FLUSH PRIVILEGES;