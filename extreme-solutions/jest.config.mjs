export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(jsx?|mjs)$': ['babel-jest', { rootMode: 'upward' }],
  },
  extensionsToTreatAsEsm: ['.jsx'],
  moduleFileExtensions: ['js', 'jsx', 'mjs'],
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/test/styleMock.cjs',
    '^@mui/x-data-grid$': '<rootDir>/test/mocks/mui-x-data-grid.cjs',
  },
};
