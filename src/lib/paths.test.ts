import { config } from './config'
import { getSourcePath, getTestPath } from './paths'

describe('paths', () => {
  describe('bad config scenarios', () => {
    test('must have `testKeyword` if no `testRoot`', () =>
      expect(() => config({ testDir: '', testKeyword: '' })).toThrow())
  })

  describe('no config', () => {
    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                   | comment
        ${'foo.ts'}           | ${undefined}               | ${'missing root'}
        ${'esm\\foo.ts'}      | ${undefined}               | ${'wrong root'}
        ${'src\\foo.cs'}      | ${undefined}               | ${'wrong file extension'}
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
        testPath                  | sourcePath            | comment
        ${'foo.test.ts'}          | ${undefined}          | ${'missing root'}
        ${'esm\\foo.test.js'}     | ${undefined}          | ${'wrong root'}
        ${'src\\foo.spec.js'}     | ${undefined}          | ${'wrong test keyword'}
        ${'src\\foo.test.cs'}     | ${undefined}          | ${'wrong file extensions'}
        ${'src\\foo.test.ts'}     | ${'src\\foo.ts'}      | ${''}
        ${'src\\foo.bar.test.ts'} | ${'src\\foo.bar.ts'}  | ${''}
        ${'src/foo.bar.test.ts'}  | ${'src\\foo.bar.ts'}  | ${''}
        ${'src/foo/bar.test.ts'}  | ${'src\\foo\\bar.ts'} | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath, _ }) =>
        expect(getSourcePath(testPath)).toEqual(sourcePath)
      )
    })
  })

  describe('explicit config', () => {
    // this matches the default, so it's the same same as no config
    const options = config({
      sourceDir: 'src',
      separateTestRoot: false,
      testDir: '',
      testKeyword: 'test',
    })
    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                   | comment
        ${'foo.ts'}           | ${undefined}               | ${'missing root'}
        ${'esm\\foo.ts'}      | ${undefined}               | ${'wrong root'}
        ${'src\\foo.cs'}      | ${undefined}               | ${'wrong file extension'}
        ${'src\\foo.ts'}      | ${'src\\foo.test.ts'}      | ${''}
        ${'src\\foo.js'}      | ${'src\\foo.test.js'}      | ${''}
        ${'src\\foo.jsx'}     | ${'src\\foo.test.jsx'}     | ${''}
        ${'src\\foo.tsx'}     | ${'src\\foo.test.tsx'}     | ${''}
        ${'src\\foo.bar.ts'}  | ${'src\\foo.bar.test.ts'}  | ${''}
        ${'src/foo.bar.ts'}   | ${'src\\foo.bar.test.ts'}  | ${''}
        ${'src/foo/bar.ts'}   | ${'src\\foo\\bar.test.ts'} | ${''}
        ${'src\\foo\\bar.ts'} | ${'src\\foo\\bar.test.ts'} | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                  | sourcePath            | comment
        ${'foo.test.ts'}          | ${undefined}          | ${'missing root'}
        ${'esm\\foo.test.js'}     | ${undefined}          | ${'wrong root'}
        ${'src\\foo.spec.js'}     | ${undefined}          | ${'wrong test keyword'}
        ${'src\\foo.test.cs'}     | ${undefined}          | ${'wrong file extensions'}
        ${'src\\foo.test.ts'}     | ${'src\\foo.ts'}      | ${''}
        ${'src\\foo.bar.test.ts'} | ${'src\\foo.bar.ts'}  | ${''}
        ${'src/foo.bar.test.ts'}  | ${'src\\foo.bar.ts'}  | ${''}
        ${'src/foo/bar.test.ts'}  | ${'src\\foo\\bar.ts'} | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath, _ }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('tests in subdirectory', () => {
    const options = config({
      testDir: 'tests',
    })

    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                          | comment
        ${'foo.ts'}           | ${undefined}                      | ${'missing root'}
        ${'esm\\foo.ts'}      | ${undefined}                      | ${'wrong root'}
        ${'src\\foo.cs'}      | ${undefined}                      | ${'wrong file extension'}
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
        ${'foo.test.ts'}                  | ${undefined}          | ${'missing root'}
        ${'esm\\tests\\foo.test.js'}      | ${undefined}          | ${'wrong root'}
        ${'src\\tests\\foo.spec.js'}      | ${undefined}          | ${'wrong test keyword'}
        ${'src\\foo.test.js'}             | ${undefined}          | ${'missing subdir'}
        ${'src\\spec\\foo.test.js'}       | ${undefined}          | ${'wrong subdir'}
        ${'src\\tests\\foo.test.cs'}      | ${undefined}          | ${'wrong file extensions'}
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
      testDir: 'tests',
      testKeyword: '',
      separateTestRoot: false,
    })
    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                     | comment
        ${'foo.ts'}           | ${undefined}                 | ${'missing root'}
        ${'esm\\foo.ts'}      | ${undefined}                 | ${'wrong root'}
        ${'src\\foo.cs'}      | ${undefined}                 | ${'wrong file extension'}
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
        ${'foo.ts'}                  | ${undefined}          | ${'missing root'}
        ${'esm\\tests\\foo.js'}      | ${undefined}          | ${'wrong root'}
        ${'src\\foo.js'}             | ${undefined}          | ${'missing subdir'}
        ${'src\\spec\\foo.js'}       | ${undefined}          | ${'wrong subdir'}
        ${'src\\tests\\foo.cs'}      | ${undefined}          | ${'wrong file extensions'}
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
      fileExtensions: ['js', 'jsx'],
    })

    describe('getTest', () => {
      test.each`
        sourcePath           | testPath                  | comment
        ${'foo.js'}          | ${undefined}              | ${'missing root'}
        ${'src\\foo.js'}     | ${undefined}              | ${'wrong root'}
        ${'esm\\foo.ts'}     | ${undefined}              | ${'wrong file extension'}
        ${'esm\\foo.tsx'}    | ${undefined}              | ${'wrong file extensions'}
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
        ${'foo.spec.js'}          | ${undefined}         | ${'missing root'}
        ${'src\\foo.spec.js'}     | ${undefined}         | ${'wrong root'}
        ${'esm\\foo.spec.ts'}     | ${undefined}         | ${'wrong file extension'}
        ${'esm\\foo.test.js'}     | ${undefined}         | ${'wrong test keyword'}
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
      separateTestRoot: true,
      testDir: '_tests',
    })

    // console.log({
    //   sourceRegex: options.sourceRegex.source,
    //   sourceReplace: options.sourceReplace,
    //   testRegex: options.testRegex.source,
    //   testReplace: options.testReplace,
    // })

    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                      | comment
        ${'foo.ts'}           | ${undefined}                  | ${'missing root'}
        ${'esm\\foo.ts'}      | ${undefined}                  | ${'wrong root'}
        ${'src\\foo.cs'}      | ${undefined}                  | ${'wrong file extension'}
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
        ${'foo.test.js'}              | ${undefined}          | ${'missing root'}
        ${'src\\foo.test.js'}         | ${undefined}          | ${'wrong root'}
        ${'_tests\\foo.test.cs'}      | ${undefined}          | ${'wrong file extension'}
        ${'_tests\\foo.spec.js'}      | ${undefined}          | ${'wrong test keyword'}
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

  describe('nested test dir', () => {
    const options = config({
      separateTestRoot: true,
      testDir: 'src\\tests',
    })

    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                          | comment
        ${'src\\foo.ts'}      | ${'src\\tests\\foo.test.ts'}      | ${''}
        ${'src\\foo.bar.ts'}  | ${'src\\tests\\foo.bar.test.ts'}  | ${''}
        ${'src\\foo\\bar.ts'} | ${'src\\tests\\foo\\bar.test.ts'} | ${''}
        ${'src/foo.bar.ts'}   | ${'src\\tests\\foo.bar.test.ts'}  | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                          | sourcePath            | comment
        ${'src\\tests\\foo.test.js'}      | ${'src\\foo.js'}      | ${''}
        ${'src\\tests\\foo.bar.test.js'}  | ${'src\\foo.bar.js'}  | ${''}
        ${'src\\tests\\foo\\bar.test.js'} | ${'src\\foo\\bar.js'} | ${''}
        ${'src\\tests/foo.bar.test.js'}   | ${'src\\foo.bar.js'}  | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('nested source root', () => {
    const options = config({
      sourceDir: 'packages/my-pkg/src',
    })

    describe('getTest', () => {
      test.each`
        sourcePath                             | testPath                                        | comment
        ${'packages/my-pkg/src/foo.ts'}        | ${'packages\\my-pkg\\src\\foo.test.ts'}         | ${''}
        ${'packages/my-pkg/src/folder/foo.ts'} | ${'packages\\my-pkg\\src\\folder\\foo.test.ts'} | ${''}
        ${'packages\\my-pkg/src/foo.ts'}       | ${'packages\\my-pkg\\src\\foo.test.ts'}         | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                                        | sourcePath                                 | comment
        ${'packages\\my-pkg\\src\\foo.test.ts'}         | ${'packages\\my-pkg\\src\\foo.ts'}         | ${''}
        ${'packages\\my-pkg\\src\\folder\\foo.test.ts'} | ${'packages\\my-pkg\\src\\folder\\foo.ts'} | ${''}
        ${'packages\\my-pkg\\src\\foo.test.ts'}         | ${'packages\\my-pkg\\src\\foo.ts'}         | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('wildcard in root', () => {
    const options = config({
      sourceDir: 'packages/**/src',
    })

    describe('getTest', () => {
      test.each`
        sourcePath                             | testPath                                        | comment
        ${'packages/pkg-1/src/foo.ts'}         | ${'packages\\pkg-1\\src\\foo.test.ts'}          | ${''}
        ${'packages/pkg-2/src/foo.ts'}         | ${'packages\\pkg-2\\src\\foo.test.ts'}          | ${''}
        ${'packages/my-pkg/src/folder/foo.ts'} | ${'packages\\my-pkg\\src\\folder\\foo.test.ts'} | ${''}
        ${'packages\\my-pkg/src/foo.ts'}       | ${'packages\\my-pkg\\src\\foo.test.ts'}         | ${''}
      `('$sourcePath -> $testPath', ({ sourcePath, testPath }) =>
        expect(getTestPath(sourcePath, options)).toEqual(testPath)
      )
    })

    describe('getSource', () => {
      test.each`
        testPath                                        | sourcePath                                 | comment
        ${'packages\\pkg-1\\src\\foo.test.ts'}          | ${'packages\\pkg-1\\src\\foo.ts'}          | ${''}
        ${'packages\\pkg-2\\src\\foo.test.ts'}          | ${'packages\\pkg-2\\src\\foo.ts'}          | ${''}
        ${'packages\\my-pkg\\src\\folder\\foo.test.ts'} | ${'packages\\my-pkg\\src\\folder\\foo.ts'} | ${''}
        ${'packages\\my-pkg\\src\\foo.test.ts'}         | ${'packages\\my-pkg\\src\\foo.ts'}         | ${''}
      `('$testPath -> $sourcePath', ({ testPath, sourcePath }) =>
        expect(getSourcePath(testPath, options)).toEqual(sourcePath)
      )
    })
  })

  describe('no testKeyword', () => {
    const options = config({
      separateTestRoot: true,
      testDir: '_tests',
      testKeyword: '',
    })

    describe('getTest', () => {
      test.each`
        sourcePath            | testPath                 | comment
        ${'foo.ts'}           | ${undefined}             | ${'missing root'}
        ${'esm\\foo.ts'}      | ${undefined}             | ${'wrong root'}
        ${'src\\foo.cs'}      | ${undefined}             | ${'wrong file extension'}
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
        ${'foo.js'}              | ${undefined}          | ${'missing root'}
        ${'src\\foo.js'}         | ${undefined}          | ${'wrong root'}
        ${'_tests\\foo.cs'}      | ${undefined}          | ${'wrong file extension'}
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
