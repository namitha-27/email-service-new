class MockProviderA {
  async sendEmail(email) {
      // Simulate a random failure or success
      if (Math.random() < 0.5) {
          throw new Error('MockProviderA simulated failure');
      }
      return 'MockProviderA success';
  }
}

module.exports = MockProviderA;
