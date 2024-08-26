const EmailService = require('./EmailService');

const emailService = new EmailService();
const email = {
  to: 'test@example.com',
  subject: 'Test Email',
  body: 'This is a test email.'
};

// Helper function to run a test and log the result
const runTest = async (emailId) => {
  console.log(`\nRunning test for email ID: ${emailId}`);
  try {
    const result = await emailService.sendEmail({ ...email, id: emailId });
    console.log('Final Email Send Result:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Run tests
runTest('1') // First test case: Simulates failure for Provider A
  .then(() => {
    // After the first test, run the second test with a different ID to ensure idempotency
    return runTest('2'); // Second test case: Should demonstrate Provider A succeeding
  });
