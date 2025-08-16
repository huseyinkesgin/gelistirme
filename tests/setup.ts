// Test setup dosyası
import 'jest';

// Global test ayarları burada yapılabilir
global.console = {
  ...console,
  // Testlerde console.log'ları gizle
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};