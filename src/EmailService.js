const MockProviderA = require('./providers/MockProviderA');
const MockProviderB = require('./providers/MockProviderB');

class EmailService {
    constructor(rateLimit = 5, rateLimitWindow = 60000) { // Default: 5 emails per minute
        this.providers = [
            { name: 'MockProviderA', instance: new MockProviderA() },
            { name: 'MockProviderB', instance: new MockProviderB() },
        ];
        this.sentEmails = new Set(); // To track idempotency
        this.rateLimit = rateLimit;
        this.rateLimitWindow = rateLimitWindow;
        this.emailTimestamps = []; // To track email send timestamps
    }

    async sendEmail(email) {
        const emailId = this.getEmailId(email);
        const results = {};

        // Rate Limiting Check
        if (!this.checkRateLimit()) {
            return { status: 'rate_limit_exceeded', message: 'Rate limit exceeded, try again later' };
        }

        // Idempotency check
        if (this.sentEmails.has(emailId)) {
            return { status: 'duplicate', message: 'Email already sent' };
        }

        // Try to send email using the first provider
        try {
            const resultA = await this.providers[0].instance.sendEmail(email);
            results[this.providers[0].name] = resultA;
            console.log(`${this.providers[0].name} result: ${resultA}`);
        } catch (error) {
            console.error(`Provider failed: ${this.providers[0].name} simulated failure`);
            results[this.providers[0].name] = null;

            // Fallback to the second provider
            try {
                const resultB = await this.providers[1].instance.sendEmail(email);
                results[this.providers[1].name] = resultB;
                console.log(`${this.providers[1].name} result: ${resultB}`);
            } catch (error) {
                console.error(`Provider failed: ${this.providers[1].name} simulated failure`);
                results[this.providers[1].name] = null;
            }
        }

        // Mark the email as sent if at least one provider succeeded
        if (Object.values(results).some(result => result !== null)) {
            this.sentEmails.add(emailId);
            this.emailTimestamps.push(Date.now()); // Log the send time
        }

        console.log('Email sent results:', results);
        return { status: 'complete', results };
    }

    getEmailId(email) {
        return `${email.to}_${email.subject}_${email.body}`;
    }

    checkRateLimit() {
        const now = Date.now();
        // Filter timestamps within the rate limit window
        this.emailTimestamps = this.emailTimestamps.filter(timestamp => now - timestamp < this.rateLimitWindow);
        return this.emailTimestamps.length < this.rateLimit;
    }
}

module.exports = EmailService;

