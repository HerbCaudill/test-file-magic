import { config } from './config'
import { getSourcePath, getTestPath } from './paths'

describe('paths', () => {
  describe('wildcard in root', () => {
    const options = config({
      sourceDir: 'packages/**/src',
    })

    console.log({
      sourceRegex: options.sourceRegex.source,
      sourceReplace: options.sourceReplace,
      testRegex: options.testRegex.source,
      testReplace: options.testReplace,
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
})
