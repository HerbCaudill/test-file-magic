import * as path from 'path'
import { rex } from './rex'

const forwardSlash = (s: string) => s.replace(/\\/g, '/')
const getRelativePath = (testPath: string, sourcePath: string) =>
  testPath === sourcePath ? './' : path.relative(testPath, sourcePath)

export const getRelativePathToModule = (sourceFile: string, testFile: string) => {
  const moduleName = path.basename(sourceFile, path.extname(sourceFile))
  const testPath = forwardSlash(path.dirname(testFile))
  const sourcePath = forwardSlash(path.dirname(sourceFile))
  const relativePath = forwardSlash(getRelativePath(testPath, sourcePath))
  const modulePath = relativePath + (relativePath.endsWith('/') ? '' : '/') + moduleName
  return modulePath
}

export const populateTemplate = (template: string[], sourceFile: string, testFile: string) => {
  const moduleName = path.basename(sourceFile, path.extname(sourceFile))
  const modulePath = getRelativePathToModule(sourceFile, testFile)
  // console.log({ template, sourceFile, testFile, moduleName, modulePath })
  return template
    .join('\n')
    .replace(rex`/\$\{moduleName\}/g`, moduleName)
    .replace(rex`/\$\{modulePath\}/g`, modulePath)
}
