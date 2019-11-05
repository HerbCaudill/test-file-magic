import { normalize } from 'path'
import { switchFiles } from './switchFiles'

describe('switchFiles', () => {
  describe('this project (test-file-magic)', () => {
    const workspaceConfig = {
      sourceDirectory: 'src',
      testDirectory: '',
      testDirectoryLocation: 'alongside',
      testKeyword: 'test',
      fileExtensions: 'js,jsx, ts, tsx',
    }
    it('should find the test file', () => {
      const actual = switchFiles('src/lib/switch.ts', workspaceConfig)
      const expected = normalize('src/lib/switch.test.ts')
      expect(actual.testFile).toEqual(expected)
    })
    it('should find the source file', () => {
      const actual = switchFiles('src/lib/switch.test.ts', workspaceConfig)
      const expected = normalize('src/lib/switch.ts')
      expect(actual.sourceFile).toEqual(expected)
    })
  })

  describe('project-euler', () => {
    const workspaceConfig = {
      sourceDirectory: 'src',
      testDirectory: 'tests',
      testDirectoryLocation: 'root',
      testKeyword: 'test',
      fileExtensions: 'js,jsx, ts, tsx',
    }
    it('should find the test file', () => {
      const actual = switchFiles('src/021.ts', workspaceConfig)
      const expected = normalize('tests/021.test.ts')
      expect(actual.testFile).toEqual(expected)
    })
    it('should find the source file', () => {
      const actual = switchFiles('tests/021.test.ts', workspaceConfig)
      const expected = normalize('src/021.ts')
      expect(actual.sourceFile).toEqual(expected)
    })
  })
})
