const MockProviderA = require('./providers/MockProviderA');
const MockProviderB = require('./providers/MockProviderB');

class EmailService {
  constructor() {
    this.providers = {
      A: new MockProviderA(1.0), // Set A to always succeed
      B: new MockProviderB(),
    };
    this.failedAttempts = { 'A': 0, 'B': 0 };
    this.sentEmails = new Set(); // To track sent emails for idempotency
    this.lastSendTime = 0; 
    this.rateLimitMs = 1000; // Basic rate limit (1 second)
  }

  async sendEmail(email) {
    // Idempotency check
    if (this.sentEmails.has(email.id)) {
      console.log(`Email with ID ${email.id} already sent.`);
      return {
        providerA: null,
        providerB: null,
      };
    }

    this.sentEmails.add(email.id);
    let result = { providerA: null, providerB: null };
    let errors = [];

    // Rate limiting
    const now = Date.now();
    if (now - this.lastSendTime < this.rateLimitMs) {
      const waitTime = this.rateLimitMs - (now - this.lastSendTime);
      console.log(`Rate limiting: Waiting for ${waitTime} ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastSendTime = Date.now();

    // Send email with Provider A
    let providerA = this.providers['A'];
    try {
      result.providerA = await providerA.send(email);
      console.log(`Provider A success`);
      return result; // Return early if Provider A succeeds
    } catch (error) {
      console.log(`Provider A error: ${error.message}`);
      errors.push('A simulated failure');
    }

    // If Provider A fails, retry with Provider B
    let providerB = this.providers['B'];
    const retryLimit = 3;
    let attempt = 0;
    while (attempt < retryLimit) {
      try {
        result.providerB = await providerB.send(email);
        console.log(`Provider B success`);
        break; // Exit loop if Provider B succeeds
      } catch (error) {
        console.log(`Provider B error: ${error.message}`);
        errors.push('B simulated failure');
        attempt++;
        if (attempt < retryLimit) {
          // Exponential backoff
          const backoffTime = Math.pow(2, attempt) * 100;
          console.log(`Retrying Provider B in ${backoffTime} ms`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        } else {
          result.providerB = null;
        }
      }
    }

    if (result.providerA === null && result.providerB === null) {
      console.error(`Failed to send email: ${errors.join(', ')}`);
    } else {
      console.log('Email sent results:', result);
    }

    return result;
  }
}

module.exports = EmailService;
