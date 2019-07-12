import { rex } from './rex'

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
  testKeyword?: string | null
  fileExtensions?: string[]
}

export const config = ({
  sourceDir = 'src',
  separateTestRoot = true,
  testDir = separateTestRoot ? sourceDir : 'tests',
  testKeyword = 'test',
  fileExtensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  if (testKeyword === null && testDir === sourceDir)
    throw new Error(MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT)

  const rx_ext = fileExtensions.join('|')
  const rx_testKeywordAndDot = testKeyword ? testKeyword + '.' : ''
  const rx_sourceRootDirAndSlash = sourceDir + '\\\\'
  const rx_testRootDirAndSlash = (separateTestRoot ? testDir : sourceDir) + '\\\\'
  const rx_testSubDirAndSlash = separateTestRoot ? '' : testDir + '\\\\'

  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      ^
      (?<root>${rx_sourceRootDirAndSlash})
      (?<path>.*\\)?
      (?<filename>.*?)\.(?<ext>${rx_ext})
      $
      /mi`
    sourceReplace = `${rx_testRootDirAndSlash}$<path>${rx_testSubDirAndSlash}$<filename>.${rx_testKeywordAndDot}$<ext>`
  }
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      ^
      (?<root>${rx_testRootDirAndSlash})
      (?<path>.*\\)?
      ${rx_testSubDirAndSlash}
      (?<filename>.*?)\.${rx_testKeywordAndDot}(?<ext>${rx_ext})
      $
      /mi`
    testReplace = `${sourceDir}\\$<path>\\$<filename>.$<ext>`
  }
  return {
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  }
}

const MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT =
  'You need to define either a test directory or a test keyword'
