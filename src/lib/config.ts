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
  testExtension?: string
  extensions?: string[]
}

export const config = ({
  sourceRoot = 'src',
  testRoot = 'tests',
  testExtension = 'test',
  extensions = ['ts', 'js', 'tsx', 'jsx'],
  sourceRegex,
  sourceReplace,
  testRegex,
  testReplace,
}: Config): InternalConfig => {
  const ext = extensions.join('|')
  if (!sourceRegex || !sourceReplace) {
    sourceRegex = rex`/
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.(?<ext>${ext})
      /mi`
    sourceReplace = `$<path>$<filename>.test.$<ext>`
  }
  if (!testRegex || !testReplace) {
    testRegex = rex`/
      (?<path>.*?\\\\)?
      (?<filename>.*?)\.${testExtension}\.(?<ext>${ext})
      /mi`
    testReplace = `$<path>$<filename>.$<ext>`
  }
  return {
    sourceRegex,
    sourceReplace,
    testRegex,
    testReplace,
  }
}
