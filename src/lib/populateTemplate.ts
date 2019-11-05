import * as path from 'path'
import { rex } from './rex'

export const populateTemplate = (template: string[], sourceFile: string, testFile: string) => {
  const extension = path.extname(sourceFile)
  const moduleName = path.basename(sourceFile, extension)
  const modulePath = path.relative(testFile, sourceFile).replace(extension, '')
  return template
    .join('\n')
    .replace(rex`/\$\{moduleName\}/g`, moduleName)
    .replace(rex`/\$\{modulePath\}/g`, modulePath)
}
