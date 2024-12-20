CREATE DATABASE email_service;

USE email_service;

CREATE TABLE email_template (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL
);

INSERT INTO email_template (template_name, subject, body) VALUES
('Welcome', 'Welcome to Our Service', '<h1>Welcome {{name}}</h1><p>Thank you for joining us!</p>');
