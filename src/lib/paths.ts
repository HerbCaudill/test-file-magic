import * as path from 'path'
import { config } from './config'

export const getTestPath = (sourcePath: string, options = config({})): string => {
  const { sourceRegex, sourceReplace } = options
  return getMatchingPath(sourcePath, sourceRegex, sourceReplace)
}

export const getSourcePath = (testPath: string, options = config({})): string => {
  const { testRegex, testReplace } = options
  return getMatchingPath(testPath, testRegex, testReplace)
}

const getMatchingPath = (pathA: string, regex: RegExp, replace: string): string => {
  pathA = path.normalize(pathA)
  return path.normalize(pathA.replace(regex, replace))
}
