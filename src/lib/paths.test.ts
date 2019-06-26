import { config } from './config'
import { getSourcePath, getTestPath } from './paths'

// The expected value defaults to the test path; so we can pass undefined
// to assert that the path will not be changed.
const SAME = undefined

describe('default options', () => {
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
    `('$sourcePath -> $testPath', ({ sourcePath, testPath = sourcePath }) =>
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
    `('$testPath -> $sourcePath', ({ testPath, sourcePath = testPath, _ }) =>
      expect(getSourcePath(testPath)).toEqual(sourcePath)
    )
  })
})

describe('custom sourceRoot, testKeyword, extensions', () => {
  const options = config({
    sourceRoot: 'esm',
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
    `('$sourcePath -> $testPath', ({ sourcePath, testPath = sourcePath }) =>
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
    `('$testPath -> $sourcePath', ({ testPath, sourcePath = testPath }) =>
      expect(getSourcePath(testPath, options)).toEqual(sourcePath)
    )
  })
})

describe('custom testRoot', () => {
  const options = config({
    testRoot: '_tests',
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
    `('$sourcePath -> $testPath', ({ sourcePath, testPath = sourcePath }) =>
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
    `('$testPath -> $sourcePath', ({ testPath, sourcePath = testPath }) =>
      expect(getSourcePath(testPath, options)).toEqual(sourcePath)
    )
  })
})
