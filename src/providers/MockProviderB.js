class MockProviderB {
  async sendEmail(email) {
      // Simulate a random failure or success
      if (Math.random() < 0.5) {
          throw new Error('MockProviderB simulated failure');
      }
      return 'MockProviderB success';
  }
}

module.exports = MockProviderB;
