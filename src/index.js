const EmailService = require('./EmailService');

const emailService = new EmailService();

const email = {
    to: 'recipient@example.com',
    subject: 'Test Email',
    body: 'This is a test email'
};

emailService.sendEmail(email)
    .then(result => console.log(result))
    .catch(error => console.error(error));
