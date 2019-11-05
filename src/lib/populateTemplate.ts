import * as path from 'path'
import { rex } from './rex'

export const getRelativePathToModule = (sourceFile: string, testFile: string) => {
  const moduleName = path.basename(sourceFile, path.extname(sourceFile))
  const testPath = path.dirname(testFile)
  const sourcePath = path.dirname(sourceFile)
  let relativePath =
    testPath === sourcePath ? './' : path.relative(testPath, sourcePath).replace(/\\/g, '/')
  const modulePath = (relativePath + '/' + moduleName).replace(/\/\//g, '/')
  return modulePath
}

export const populateTemplate = (template: string[], sourceFile: string, testFile: string) => {
  const moduleName = path.basename(sourceFile, path.extname(sourceFile))
  const modulePath = getRelativePathToModule(sourceFile, testFile)
  return template
    .join('\n')
    .replace(rex`/\$\{moduleName\}/g`, moduleName)
    .replace(rex`/\$\{modulePath\}/g`, modulePath)
}
