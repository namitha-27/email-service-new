const EmailService = require('../src/EmailService');
const MockProviderA = require('../src/providers/MockProviderA');
const MockProviderB = require('../src/providers/MockProviderB');

jest.mock('../src/providers/MockProviderA');
jest.mock('../src/providers/MockProviderB');

describe('EmailService', () => {
    let emailService;

    beforeEach(() => {
        emailService = new EmailService();
    });

    test('should send email with Provider A success', async () => {
        MockProviderA.send.mockResolvedValue('MockProviderA success');
        MockProviderB.send.mockResolvedValue('MockProviderB success');

        const email = { id: '1', content: 'Test Email' };
        const result = await emailService.sendEmail(email);

        expect(result).toEqual({ providerA: 'MockProviderA success', providerB: null });
    });

    test('should retry Provider B on failure', async () => {
        MockProviderA.send.mockRejectedValue(new Error('Provider A failure'));
        MockProviderB.send.mockResolvedValue('MockProviderB success');

        const email = { id: '2', content: 'Test Email' };
        const result = await emailService.sendEmail(email);

        expect(result).toEqual({ providerA: null, providerB: 'MockProviderB success' });
    });

    test('should handle idempotency', async () => {
        MockProviderA.send.mockResolvedValue('MockProviderA success');
        MockProviderB.send.mockResolvedValue('MockProviderB success');

        const email = { id: '3', content: 'Test Email' };
        await emailService.sendEmail(email);
        const result = await emailService.sendEmail(email); // Should not resend

        expect(result).toEqual({ providerA: null, providerB: null });
    });

    test('should respect rate limiting', async () => {
        MockProviderA.send.mockRejectedValue(new Error('Provider A failure'));
        MockProviderB.send.mockResolvedValue('MockProviderB success');

        const email = { id: '4', content: 'Test Email' };
        const start = Date.now();
        await emailService.sendEmail(email);
        const end = Date.now();

        // Adjusted tolerance to account for slight variations in timing
        expect(end - start).toBeGreaterThanOrEqual(emailService.rateLimitMs - 50);
    });
});
