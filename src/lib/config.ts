import { rex } from './rex'
// import esc = require('escape-string-regexp')
import { normalize } from 'path'

const esc = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\-/g, '\\-')
    .replace(/\*\*/g, '.*')

expect(esc('\\_foo-bar\\')).toBe('\\\\_foo\\-bar\\\\')
expect(esc('\\packages\\**\\src\\')).toBe('\\\\packages\\\\.*\\\\src\\\\')

export interface InternalConfig {
  sourceRegex: RegExp
  sourceReplace: string
  testRegex: RegExp
  testReplace: string
}

export interface Config extends Partial<InternalConfig> {
  sourceDir?: string
  testDir?: string
  separateTestRoot?: boolean
  testKeyword?: string
  fileExtensions?: string | string[]
}

export const config = ({
  sourceDir = 'src',
  separateTestRoot = false,
  testDir = '',
  testKeyword = 'test',
  fileExtensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  if (!testKeyword.length && !testDir.length)
    throw new Error(MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT)

  // make \ and / consistent for this file system
  sourceDir = normalize(sourceDir)
  if (testDir.length) testDir = normalize(testDir)

  // make array of file extensions
  if (typeof fileExtensions === 'string') fileExtensions = fileExtensions.split(/,/g)
  fileExtensions = fileExtensions.map(s => s.replace(/\./g, '').trim()) // trim dots from file extensions

  // console.log({ sourceDir, separateTestRoot, testDir, testKeyword })
  const rx_extensions = fileExtensions.join('|')
  const rx_testKeywordAndDot = testKeyword ? testKeyword + '.' : ''
  const rx_sourceRootDirAndSlash = sourceDir + '\\'
  const rx_testRootDirAndSlash = (separateTestRoot ? testDir : sourceDir) + '\\'
  const rx_testSubDirAndSlash = !separateTestRoot && testDir.length > 0 ? testDir + '\\' : ''

  const rep_sourceRootDirAndSlash = (separateTestRoot ? sourceDir : '$<root>') + '\\'
  const rep_testRootDirAndSlash = (separateTestRoot ? testDir : '$<root>') + '\\'

  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      ^
      (?<root>${esc(rx_sourceRootDirAndSlash)})
      (?<path>.*\\)?
      (?<filename>.*?)\.(?<ext>${rx_extensions})
      $
      /mi`
    sourceReplace = `${rep_testRootDirAndSlash}$<path>${rx_testSubDirAndSlash}\\$<filename>.${rx_testKeywordAndDot}$<ext>`
  }
  // console.log('rx_testSubDirAndSlash', rx_testSubDirAndSlash, esc(rx_testSubDirAndSlash))
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      ^
      (?<root>${esc(rx_testRootDirAndSlash)})
      (?<path>.*\\)?
      ${esc(rx_testSubDirAndSlash)}
      (?<filename>.*?)\.${esc(rx_testKeywordAndDot)}(?<ext>${rx_extensions})
      $
      /mi`
    testReplace = `${rep_sourceRootDirAndSlash}$<path>$<filename>.$<ext>`
  }

  // console.log({
  //   sourceRegex: sourceRegex.toString(),
  //   sourceReplace,
  //   testRegex: testRegex.toString(),
  //   testReplace,
  // })
  return {
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  }
}

const MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT =
  'You need to define either a test directory or a test keyword'
