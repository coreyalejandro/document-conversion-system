module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
roots: ['<rootDir>/src'],
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
transform: {
  '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'commonjs' } }],
},
globals: {
  'ts-jest': {
    tsconfig: {
      jsx: 'react-jsx',
      module: 'commonjs',
    },
  },
},
};
