module.exports = {
  verbose: true,
  roots: ["<rootDir>/src"],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/globals.d.ts"
  },
  testEnvironment: 'jsdom',
  setupFiles: [
    "<rootDir>/jest-shim.js",
    "<rootDir>/jest-setup.js"
  ]
};