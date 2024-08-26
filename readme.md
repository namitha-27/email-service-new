Email Service

Overview

This project implements a resilient email sending service using JavaScript. The service includes a fallback mechanism with two mock email providers, a retry logic with exponential backoff, and basic rate limiting. The code demonstrates handling email sending with both primary and fallback providers, logging errors, and ensuring idempotency.

Features

Resilient Email Sending: Uses two mock providers to demonstrate fallback behavior.
Retry Logic: Includes retry mechanism with exponential backoff for handling temporary failures.
Idempotency: Prevents duplicate email sends.
Basic Rate Limiting: Ensures emails are sent at controlled intervals.
Status Tracking: Provides detailed status of email sending attempts.
Key Components

EmailService Class: Manages the sending of emails with fallback between two mock providers.
Mock Providers: Simulate email providers for demonstration purposes.
Logging: Logs errors and results to the console.
Installation

Clone the Repository: git clone https://github.com/namitha-27/email-service-new.git cd email-service

Install Dependencies: npm install

Start the Application: npm start