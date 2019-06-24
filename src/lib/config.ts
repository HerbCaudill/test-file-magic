import { rex } from './rex'

export interface InternalConfig {
  sourceRegex: RegExp
  sourceReplace: string
  testRegex: RegExp
  testReplace: string
}

export interface Config extends Partial<InternalConfig> {
  sourceRoot?: string
  testRoot?: string | null
  testKeyword?: string
  extensions?: string[]
}

export const config = ({
  sourceRoot = 'src',
  testRoot = 'tests',
  testKeyword = 'test',
  extensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  const ext = extensions.join('|')
  const sourceRootRegex = sourceRoot.length > 0 ? `(?<root>${sourceRoot})` : ''
  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      ${sourceRootRegex}
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.(?<ext>${ext})
      /mi`
    sourceReplace = `$<root>$<path>$<filename>.${testKeyword}.$<ext>`
  }
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      ${sourceRootRegex}
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.${testKeyword}\.(?<ext>${ext})
      /mi`
    testReplace = `$<root>$<path>$<filename>.$<ext>`
  }
  return {
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  }
}
