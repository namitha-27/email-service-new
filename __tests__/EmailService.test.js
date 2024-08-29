const MockProviderA = require('../providers/MockProviderA'); 
const MockProviderB = require('../providers/MockProviderB'); 
const EmailService = require('../EmailService');

describe('EmailService', () => {
    let emailService;

    beforeEach(() => {
        emailService = new EmailService();
    });

    it('should send email using MockProviderA', async () => {
        // Mock successful send for MockProviderA
        jest.spyOn(MockProviderA.prototype, 'sendEmail').mockResolvedValue('MockProviderA success');
        jest.spyOn(MockProviderB.prototype, 'sendEmail').mockResolvedValue('MockProviderB success');

        const email = { to: 'recipient@example.com', subject: 'Test Email', body: 'This is a test email' };
        const result = await emailService.sendEmail(email);
        
        expect(result.status).toBe('complete'); 
        expect(result.results.MockProviderA).toBe('MockProviderA success');
        expect(result.results.MockProviderB).toBeUndefined(); 
    });

    it('should fallback to MockProviderB if MockProviderA fails', async () => {
        // Mock failure for MockProviderA and success for MockProviderB
        jest.spyOn(MockProviderA.prototype, 'sendEmail').mockRejectedValue(new Error('MockProviderA simulated failure'));
        jest.spyOn(MockProviderB.prototype, 'sendEmail').mockResolvedValue('MockProviderB success');

        const email = { to: 'recipient@example.com', subject: 'Test Email', body: 'This is a test email' };
        const result = await emailService.sendEmail(email);
        
       
        expect(result.status).toBe('complete');
        expect(result.results.MockProviderA).toBeNull(); 
        expect(result.results.MockProviderB).toBe('MockProviderB success');
    });

    it('should handle both providers failing', async () => {
        // Mock failure for both providers
        jest.spyOn(MockProviderA.prototype, 'sendEmail').mockRejectedValue(new Error('MockProviderA simulated failure'));
        jest.spyOn(MockProviderB.prototype, 'sendEmail').mockRejectedValue(new Error('MockProviderB simulated failure'));

        const email = { to: 'recipient@example.com', subject: 'Test Email', body: 'This is a test email' };
        const result = await emailService.sendEmail(email);

        expect(result.status).toBe('complete');
        expect(result.results.MockProviderA).toBeNull(); 
        expect(result.results.MockProviderB).toBeNull(); 
    });
});
