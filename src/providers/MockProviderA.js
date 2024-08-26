class MockProviderA {
  static async send(email) {
      // Simulating a failure for demonstration purposes
      throw new Error('MockProviderA failure');
  }
}

module.exports = MockProviderA;
