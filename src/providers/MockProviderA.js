class MockProviderA {
    constructor() {
      this.name = 'A';
    }
  
    async send(email) {
      // Simulate failure for the first test
      if (email.id === '1') {
        throw new Error('MockProviderA simulated failure');
      }
      return 'MockProviderA success';
    }
  }
  
  module.exports = MockProviderA;
  