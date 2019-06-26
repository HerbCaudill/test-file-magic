import { rex } from './rex'

export interface InternalConfig {
  sourceRegex: RegExp
  sourceReplace: string
  testRegex: RegExp
  testReplace: string
}

export interface Config extends Partial<InternalConfig> {
  sourceRoot?: string
  testRoot?: string
  testKeyword?: string
  extensions?: string[]
}

export const config = ({
  sourceRoot = 'src',
  testRoot = sourceRoot,
  testKeyword = 'test',
  extensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  const ext = extensions.join('|')
  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      (?<root>${sourceRoot})
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.(?<ext>${ext})
      /mi`
    sourceReplace = `${testRoot}$<path>$<filename>.${testKeyword}.$<ext>`
  }
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      (?<root>${testRoot})
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.${testKeyword}\.(?<ext>${ext})
      /mi`
    testReplace = `${sourceRoot}$<path>$<filename>.$<ext>`
  }
  return {
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  }
}
