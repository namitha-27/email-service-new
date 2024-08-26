const EmailService = require('../EmailService');
const MockProviderA = require('../providers/MockProviderA');
const MockProviderB = require('../providers/MockProviderB');

jest.mock('../providers/MockProviderA');
jest.mock('../providers/MockProviderB');

describe('EmailService', () => {
  let emailService;

  beforeEach(() => {
    MockProviderA.mockClear();
    MockProviderB.mockClear();
    emailService = new EmailService();
  });

  test('should send email with Provider A success', async () => {
    // Mock Provider A to always succeed
    MockProviderA.prototype.send.mockResolvedValue('MockProviderA success');
    MockProviderB.prototype.send.mockResolvedValue('MockProviderB success');

    const email = { id: '1', to: 'test@example.com', subject: 'Test Email', body: 'This is a test email.' };
    const result = await emailService.sendEmail(email);
    expect(result.providerA).toBe('MockProviderA success');
    expect(result.providerB).toBe(null);
  });

  test('should retry Provider B on failure', async () => {
    // Mock Provider A to fail and Provider B to succeed
    MockProviderA.prototype.send.mockRejectedValue(new Error('MockProviderA simulated failure'));
    MockProviderB.prototype.send.mockResolvedValue('MockProviderB success');

    const email = { id: '2', to: 'test@example.com', subject: 'Test Email', body: 'This is a test email.' };
    const result = await emailService.sendEmail(email);
    expect(result.providerA).toBe(null);
    expect(result.providerB).toBe('MockProviderB success');
  });
});
