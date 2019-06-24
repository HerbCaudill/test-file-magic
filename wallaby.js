module.exports = function(wallaby) {
  return {
    files: ['src/lib**/*.ts', '!src/lib/**/*.test.ts'],
    tests: ['src/lib/**/*.test.ts'],
    env: { type: 'node' },
    testFramework: 'jest',
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({
        module: 'commonjs',
      }),
    },
  }
}
