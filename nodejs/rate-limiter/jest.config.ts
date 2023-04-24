import path from 'path';

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    rootDir: path.join(__dirname, 'src'),
    testMatch: ['**/__tests__/*.test.ts']
};
