class MockProviderB {
  static async send(email) {
      return 'MockProviderB success';
  }
}

module.exports = MockProviderB;
