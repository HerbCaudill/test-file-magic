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
  singleTestRoot?: boolean
  testKeyword?: string | null
  extensions?: string[]
}
export const config = ({
  sourceDir = 'src',
  testDir = sourceDir,
  singleTestRoot = true,
  testKeyword = 'test',
  extensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  const ext = extensions.join('|')
  const testKeywordAndDot = testKeyword ? testKeyword + '.' : ''

  if (testKeyword === null && testDir === sourceDir)
    throw new Error(MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT)

  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      (?<root>${sourceDir})
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.(?<ext>${ext})
      /mi`
    sourceReplace = `${testDir}$<path>$<filename>.${testKeywordAndDot}$<ext>`
  }
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      (?<root>${testDir})
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.${testKeywordAndDot}(?<ext>${ext})
      /mi`
    testReplace = `${sourceDir}$<path>$<filename>.$<ext>`
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
