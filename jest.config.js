const { defaults: tsjPreset } = require('ts-jest/presets')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
    preset: '@shelf/jest-mongodb',
    transform: {
        ...tsjPreset.transform
    },
    moduleNameMapper: {
        "uuid": require.resolve('uuid'),
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    watchPathIgnorePatterns: ['globalConfig'],
};
