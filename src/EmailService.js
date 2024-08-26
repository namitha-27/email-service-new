const MockProviderA = require('./providers/MockProviderA');
const MockProviderB = require('./providers/MockProviderB');

class EmailService {
    constructor() {
        this.sentEmails = new Set();
        this.rateLimitMs = 1000; // 1 second for rate limiting
    }

    async sendEmail(email) {
        if (this.sentEmails.has(email.id)) {
            console.log(`Email with ID ${email.id} already sent.`);
            return { providerA: null, providerB: null };
        }

        this.sentEmails.add(email.id);

        const startTime = Date.now();
        let result = { providerA: null, providerB: null };

        try {
            result.providerA = await MockProviderA.send(email);
        } catch (error) {
            console.log(`Provider A error: ${error.message}`);
            try {
                result.providerB = await MockProviderB.send(email);
            } catch (error) {
                console.log(`Provider B error: ${error.message}`);
            }
        }

        const endTime = Date.now();
        if (endTime - startTime < this.rateLimitMs) {
            await new Promise(resolve => setTimeout(resolve, this.rateLimitMs - (endTime - startTime)));
        }

        console.log(`Email sent results: ${JSON.stringify(result)}`);
        return result;
    }
}

module.exports = EmailService;
