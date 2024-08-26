class MockProviderB {
    constructor() {
      this.name = 'B';
    }
  
    async send(email) {
      if (Math.random() > 0.5) {
        return 'MockProviderB success';
      } else {
        throw new Error('MockProviderB simulated failure');
      }
    }
  }
  
  module.exports = MockProviderB;
  