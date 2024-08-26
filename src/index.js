const EmailService = require('./EmailService');

const emailService = new EmailService();

async function runTests() {
    console.log('Running test for email ID: 1');
    await emailService.sendEmail({ id: '1', content: 'Test Email 1' });

    console.log('Running test for email ID: 2');
    await emailService.sendEmail({ id: '2', content: 'Test Email 2' });

    console.log('Running test for email ID: 3');
    await emailService.sendEmail({ id: '3', content: 'Test Email 3' });
}

runTests().catch(err => console.error(err));
