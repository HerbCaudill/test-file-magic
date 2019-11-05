import { config } from './config'
import { getSourcePath, getTestPath } from './paths'

export const switchFiles = (filePath: string, workspaceConfig: any) => {
  // User can't set things to `undefined` in the UI, so we treat empty strings as undefined so
  // the `config` function's defaults will kick in.
  const emptyAsUndefined = (s: string | undefined) => (s === '' ? undefined : s)

  const settings = {
    sourceDir: emptyAsUndefined(workspaceConfig.sourceDirectory),
    testDir: workspaceConfig.testDirectory,
    testKeyword: emptyAsUndefined(workspaceConfig.testKeyword),
    separateTestRoot: workspaceConfig.testDirectoryLocation === 'root',
    fileExtensions: workspaceConfig.fileExtensions.split(','),
  }

  const options = config(settings)
  const sourceFile = getSourcePath(filePath, options)
  const testFile = getTestPath(filePath, options)

  return { sourceFile, testFile }
}
