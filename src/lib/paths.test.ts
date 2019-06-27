import { config } from './config'
import { getSourcePath, getTestPath } from './paths'

// The expected value defaults to the original path; so we can pass undefined to assert that the path will not be changed.
const SAME = undefined

describe('paths', () => {
  describe('bad config scenarios', () => {
    test('must have `testKeyword` if no `testRoot`', () =>
      expect(() => config({ testDir: undefined, testKeyword: null })).toThrow())
  })

  describe('default config', () => {
    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                   | comment
        ${'foo.ts'}           | ${SAME}                    | ${'missing root'}
        ${'esm\\foo.ts'}      | ${SAME}                    | ${'wrong root'}
        ${'src\\foo.cs'}      | ${SAME}                    | ${'wrong file extension'}
        ${'src\\foo.ts'}      | ${'src\\foo.test.ts'}      | ${''}
        ${'src\\foo.js'}      | ${'src\\foo.test.js'}      | ${''}
        ${'src\\foo.jsx'}     | ${'src\\foo.test.jsx'}     | ${''}
        ${'src\\foo.tsx'}     | ${'src\\foo.test.tsx'}     | ${''}
        ${'src\\foo.bar.ts'}  | ${'src\\foo.bar.test.ts'}  | ${''}
        ${'src/foo.bar.ts'}   | ${'src\\foo.bar.test.ts'}  | ${''}
        ${'src\\foo\\bar.ts'} | ${'src\\foo\\bar.test.ts'} | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                  | sourcePath           | comment
        ${'foo.test.ts'}          | ${SAME}              | ${'missing root'}
        ${'esm\\foo.test.js'}     | ${SAME}              | ${'wrong root'}
        ${'src\\foo.spec.js'}     | ${SAME}              | ${'wrong test keyword'}
        ${'src\\foo.test.cs'}     | ${SAME}              | ${'wrong file extensions'}
        ${'src\\foo.test.ts'}     | ${'src\\foo.ts'}     | ${''}
        ${'src\\foo.bar.test.ts'} | ${'src\\foo.bar.ts'} | ${''}
        ${'src/foo.bar.test.ts'}  | ${'src\\foo.bar.ts'} | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath, _ }) =>
        expect(getSourcePath(testPath)).toEqual(sourcePath)
      )
    })
  })

  describe('tests in subdirectory', () => {
    const options = config({
      singleTestRoot: false,
    })
    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                          | comment
        ${'foo.ts'}           | ${SAME}                           | ${'missing root'}
        ${'esm\\foo.ts'}      | ${SAME}                           | ${'wrong root'}
        ${'src\\foo.cs'}      | ${SAME}                           | ${'wrong file extension'}
        ${'src\\foo.js'}      | ${'src\\tests\\foo.test.js'}      | ${''}
        ${'src\\foo.ts'}      | ${'src\\tests\\foo.test.ts'}      | ${''}
        ${'src\\foo.jsx'}     | ${'src\\tests\\foo.test.jsx'}     | ${''}
        ${'src\\foo.tsx'}     | ${'src\\tests\\foo.test.tsx'}     | ${''}
        ${'src\\foo.bar.ts'}  | ${'src\\tests\\foo.bar.test.ts'}  | ${''}
        ${'src/foo.bar.ts'}   | ${'src\\tests\\foo.bar.test.ts'}  | ${''}
        ${'src/foo/bar.ts'}   | ${'src\\foo\\tests\\bar.test.ts'} | ${''}
        ${'src\\foo\\bar.ts'} | ${'src\\foo\\tests\\bar.test.ts'} | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                          | sourcePath            | comment
        ${'foo.test.ts'}                  | ${SAME}               | ${'missing root'}
        ${'esm\\tests\\foo.test.js'}      | ${SAME}               | ${'wrong root'}
        ${'src\\tests\\foo.spec.js'}      | ${SAME}               | ${'wrong test keyword'}
        ${'src\\foo.test.js'}             | ${SAME}               | ${'missing subdir'}
        ${'src\\spec\\foo.test.js'}       | ${SAME}               | ${'wrong subdir'}
        ${'src\\tests\\foo.test.cs'}      | ${SAME}               | ${'wrong file extensions'}
        ${'src\\tests\\foo.test.ts'}      | ${'src\\foo.ts'}      | ${''}
        ${'src\\tests\\foo.bar.test.ts'}  | ${'src\\foo.bar.ts'}  | ${''}
        ${'src\\foo\\tests\\bar.test.ts'} | ${'src\\foo\\bar.ts'} | ${''}
        ${'src/tests/foo.bar.test.ts'}    | ${'src\\foo.bar.ts'}  | ${''}
        ${'src/foo/tests/bar.test.ts'}    | ${'src\\foo\\bar.ts'} | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath, _ }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('tests in subdirectory, no keyword', () => {
    const options = config({
      testKeyword: null,
      singleTestRoot: false,
    })
    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                     | comment
        ${'foo.ts'}           | ${SAME}                      | ${'missing root'}
        ${'esm\\foo.ts'}      | ${SAME}                      | ${'wrong root'}
        ${'src\\foo.cs'}      | ${SAME}                      | ${'wrong file extension'}
        ${'src\\foo.js'}      | ${'src\\tests\\foo.js'}      | ${''}
        ${'src\\foo.ts'}      | ${'src\\tests\\foo.ts'}      | ${''}
        ${'src\\foo.jsx'}     | ${'src\\tests\\foo.jsx'}     | ${''}
        ${'src\\foo.tsx'}     | ${'src\\tests\\foo.tsx'}     | ${''}
        ${'src\\foo.bar.ts'}  | ${'src\\tests\\foo.bar.ts'}  | ${''}
        ${'src/foo.bar.ts'}   | ${'src\\tests\\foo.bar.ts'}  | ${''}
        ${'src/foo/bar.ts'}   | ${'src\\foo\\tests\\bar.ts'} | ${''}
        ${'src\\foo\\bar.ts'} | ${'src\\foo\\tests\\bar.ts'} | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                     | sourcePath            | comment
        ${'foo.ts'}                  | ${SAME}               | ${'missing root'}
        ${'esm\\tests\\foo.js'}      | ${SAME}               | ${'wrong root'}
        ${'src\\foo.js'}             | ${SAME}               | ${'missing subdir'}
        ${'src\\spec\\foo.js'}       | ${SAME}               | ${'wrong subdir'}
        ${'src\\tests\\foo.cs'}      | ${SAME}               | ${'wrong file extensions'}
        ${'src\\tests\\foo.ts'}      | ${'src\\foo.ts'}      | ${''}
        ${'src\\tests\\foo.bar.ts'}  | ${'src\\foo.bar.ts'}  | ${''}
        ${'src\\foo\\tests\\bar.ts'} | ${'src\\foo\\bar.ts'} | ${''}
        ${'src/tests/foo.bar.ts'}    | ${'src\\foo.bar.ts'}  | ${''}
        ${'src/foo/tests/bar.ts'}    | ${'src\\foo\\bar.ts'} | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath, _ }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('custom sourceRoot, testKeyword, extensions', () => {
    const options = config({
      sourceDir: 'esm',
      testKeyword: 'spec',
      extensions: ['js', 'jsx'],
    })

    describe('getTest', () => {
      test.each`
        sourcePath           | testPath                  | comment
        ${'foo.js'}          | ${SAME}                   | ${'missing root'}
        ${'src\\foo.js'}     | ${SAME}                   | ${'wrong root'}
        ${'esm\\foo.ts'}     | ${SAME}                   | ${'wrong file extension'}
        ${'esm\\foo.tsx'}    | ${SAME}                   | ${'wrong file extensions'}
        ${'esm\\foo.js'}     | ${'esm\\foo.spec.js'}     | ${''}
        ${'esm\\foo.jsx'}    | ${'esm\\foo.spec.jsx'}    | ${''}
        ${'esm\\foo.bar.js'} | ${'esm\\foo.bar.spec.js'} | ${''}
        ${'esm/foo.bar.js'}  | ${'esm\\foo.bar.spec.js'} | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                  | sourcePath           | comment
        ${'foo.spec.js'}          | ${SAME}              | ${'missing root'}
        ${'src\\foo.spec.js'}     | ${SAME}              | ${'wrong root'}
        ${'esm\\foo.spec.ts'}     | ${SAME}              | ${'wrong file extension'}
        ${'esm\\foo.test.js'}     | ${SAME}              | ${'wrong test keyword'}
        ${'esm\\foo.spec.js'}     | ${'esm\\foo.js'}     | ${''}
        ${'esm\\foo.spec.jsx'}    | ${'esm\\foo.jsx'}    | ${''}
        ${'esm\\foo.bar.spec.js'} | ${'esm\\foo.bar.js'} | ${''}
        ${'esm/foo.bar.spec.js'}  | ${'esm\\foo.bar.js'} | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('custom testRoot', () => {
    const options = config({
      testDir: '_tests',
    })

    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                      | comment
        ${'foo.ts'}           | ${SAME}                       | ${'missing root'}
        ${'esm\\foo.ts'}      | ${SAME}                       | ${'wrong root'}
        ${'src\\foo.cs'}      | ${SAME}                       | ${'wrong file extension'}
        ${'src\\foo.ts'}      | ${'_tests\\foo.test.ts'}      | ${''}
        ${'src\\foo.js'}      | ${'_tests\\foo.test.js'}      | ${''}
        ${'src\\foo.jsx'}     | ${'_tests\\foo.test.jsx'}     | ${''}
        ${'src\\foo.tsx'}     | ${'_tests\\foo.test.tsx'}     | ${''}
        ${'src\\foo.bar.ts'}  | ${'_tests\\foo.bar.test.ts'}  | ${''}
        ${'src\\foo\\bar.ts'} | ${'_tests\\foo\\bar.test.ts'} | ${''}
        ${'src/foo.bar.ts'}   | ${'_tests\\foo.bar.test.ts'}  | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                      | sourcePath            | comment
        ${'foo.test.js'}              | ${SAME}               | ${'missing root'}
        ${'src\\foo.test.js'}         | ${SAME}               | ${'wrong root'}
        ${'_tests\\foo.test.cs'}      | ${SAME}               | ${'wrong file extension'}
        ${'_tests\\foo.spec.js'}      | ${SAME}               | ${'wrong test keyword'}
        ${'_tests\\foo.test.js'}      | ${'src\\foo.js'}      | ${''}
        ${'_tests\\foo.test.jsx'}     | ${'src\\foo.jsx'}     | ${''}
        ${'_tests\\foo.bar.test.js'}  | ${'src\\foo.bar.js'}  | ${''}
        ${'_tests\\foo\\bar.test.js'} | ${'src\\foo\\bar.js'} | ${''}
        ${'_tests/foo.bar.test.js'}   | ${'src\\foo.bar.js'}  | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('no testKeyword', () => {
    const options = config({
      testDir: '_tests',
      testKeyword: null,
    })

    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                 | comment
        ${'foo.ts'}           | ${SAME}                  | ${'missing root'}
        ${'esm\\foo.ts'}      | ${SAME}                  | ${'wrong root'}
        ${'src\\foo.cs'}      | ${SAME}                  | ${'wrong file extension'}
        ${'src\\foo.ts'}      | ${'_tests\\foo.ts'}      | ${''}
        ${'src\\foo.js'}      | ${'_tests\\foo.js'}      | ${''}
        ${'src\\foo.jsx'}     | ${'_tests\\foo.jsx'}     | ${''}
        ${'src\\foo.tsx'}     | ${'_tests\\foo.tsx'}     | ${''}
        ${'src\\foo.bar.ts'}  | ${'_tests\\foo.bar.ts'}  | ${''}
        ${'src\\foo\\bar.ts'} | ${'_tests\\foo\\bar.ts'} | ${''}
        ${'src/foo.bar.ts'}   | ${'_tests\\foo.bar.ts'}  | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                 | sourcePath            | comment
        ${'foo.js'}              | ${SAME}               | ${'missing root'}
        ${'src\\foo.js'}         | ${SAME}               | ${'wrong root'}
        ${'_tests\\foo.cs'}      | ${SAME}               | ${'wrong file extension'}
        ${'_tests\\foo.js'}      | ${'src\\foo.js'}      | ${''}
        ${'_tests\\foo.jsx'}     | ${'src\\foo.jsx'}     | ${''}
        ${'_tests\\foo.bar.js'}  | ${'src\\foo.bar.js'}  | ${''}
        ${'_tests\\foo\\bar.js'} | ${'src\\foo\\bar.js'} | ${''}
        ${'_tests/foo.bar.js'}   | ${'src\\foo.bar.js'}  | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })
})
