import * as path from 'path'
import { config } from './config'

export const getTest = (sourcePath: string, options = config({})): string => {
  const { sourceRegex, sourceReplace } = options
  sourcePath = path.normalize(sourcePath)
  return path.normalize(sourcePath.replace(sourceRegex, sourceReplace))
}

export const getSource = (testPath: string, options = config({})): string => {
  const { testRegex, testReplace } = options
  testPath = path.normalize(testPath)
  return path.normalize(testPath.replace(testRegex, testReplace))
}
