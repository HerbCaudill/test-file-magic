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
  extensions?: string[]
}

export const config = ({
  sourceDir = 'src',
  separateTestRoot = true,
  testDir = separateTestRoot ? sourceDir : 'tests',
  testKeyword = 'test',
  extensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  if (testKeyword === null && testDir === sourceDir)
    throw new Error(MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT)

  const ext = extensions.join('|')
  const testKeywordAndDot = testKeyword ? testKeyword + '.' : ''

  const sourceRootDir = sourceDir + '\\\\'
  const testRootDir = (separateTestRoot ? testDir : sourceDir) + '\\\\'
  const testSubDirAndSlash = separateTestRoot ? '' : testDir + '\\\\'

  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      ^
      (?<root>${sourceRootDir})
      (?<path>.*\\)?
      (?<filename>.*?)\.(?<ext>${ext})
      $
      /mi`
    sourceReplace = `${testRootDir}$<path>${testSubDirAndSlash}$<filename>.${testKeywordAndDot}$<ext>`
  }
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      ^
      (?<root>${testRootDir})
      (?<path>.*\\)?
      ${testSubDirAndSlash}
      (?<filename>.*?)\.${testKeywordAndDot}(?<ext>${ext})
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
