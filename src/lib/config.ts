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
  fileExtensions?: string | string[]
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

  // make array of file extensions
  if (typeof fileExtensions === 'string') fileExtensions = fileExtensions.split(/,/g)
  // remove dots from file extensions
  fileExtensions = fileExtensions.map(s => s.replace(/\./g, '').trim())

  // console.log({ sourceDir, separateTestRoot, testDir, testKeyword })
  const rx_extensions = fileExtensions.join('|')
  const rx_testKeywordAndDot = testKeyword ? testKeyword + '.' : ''
  const rx_sourceRootDirAndSlash = sourceDir + '\\\\'
  const rx_testRootDirAndSlash = (separateTestRoot ? testDir : sourceDir) + '\\\\'
  const rx_testSubDirAndSlash = !separateTestRoot && testDir.length > 0 ? testDir + '\\\\' : ''

  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      ^
      (?<root>${rx_sourceRootDirAndSlash})
      (?<path>.*\\)?
      (?<filename>.*?)\.(?<ext>${rx_extensions})
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
      (?<filename>.*?)\.${rx_testKeywordAndDot}(?<ext>${rx_extensions})
      $
      /mi`
    testReplace = `${sourceDir}\\$<path>\\$<filename>.$<ext>`
  }
  console.log({
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  })
  return {
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  }
}

const MSG_MUST_HAVE_TEST_KEYWORD_IF_NO_TEST_ROOT =
  'You need to define either a test directory or a test keyword'
