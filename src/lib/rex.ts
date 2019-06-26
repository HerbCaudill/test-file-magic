// TODO: Move to own library

/**
 * This utility lets you create regular expressions from string template literals.
 *
 * It supports composing regular expressions:
 * ```js
 * const RE_YEAR = /([0-9]{4})/
 * const RE_MONTH = /([0-9]{2})/
 * const RE_DAY = /([0-9]{2})/
 * const RE_DATE = rex`/^${RE_YEAR}-${RE_MONTH}-${RE_DAY}$/u`
 * ```
 *
 * It also supports free spacing and comments:
 * ```js
 * const r = rex`/
 *   (?<path>.*?\\)?                       # path
 *   (?<filename>.*?)\.test\.(?<ext>ts|js) # filename
 *   /mi`
 *```
 */
export const rex: RegExBuilder = (literals, ...placeholders) => {
  const literalSource = literals.raw.map(stripFreespaceAndComments)
  const s =
    literalSource[0] +
    placeholders
      .map(
        (replacement, i) =>
          (replacement instanceof RegExp //
            ? replacement.source
            : replacement) + literalSource[i + 1]
      )
      .join('')
  const { source, flags } = getSourceAndFlags(s)
  return new RegExp(source, flags)
}

/**
 * Parses a string into regex source and flags:
 * ```js
 * getSourceAndFlags('/(.*)/gi') === {source: '(.*)', flags: 'gi'}
 * getSourceAndFlags('(.*)') === {source: '(.*)'}
 * ```
 * @param s the string to parse
 */
const getSourceAndFlags = (s: string) => {
  if (s.startsWith('/')) {
    const lastSlashIndex = s.lastIndexOf('/')
    if (lastSlashIndex === 0) throw new Error(MSG_MISMATCHED_SLASH + s)
    return {
      source: s.slice(1, lastSlashIndex),
      flags: s.slice(lastSlashIndex + 1),
    }
  } else {
    return { source: s }
  }
}

/**
 * Removes all freespace and comments from a single line of a multiline regex.
 * @param s the line from the regex source string
 */
export const stripFreespaceAndComments = (s: string) =>
  s
    .split('\n')
    .map(line => line.replace(/(#.*)/, '').trim())
    .join('')

const MSG_MISMATCHED_SLASH =
  'If the `re` string starts with a slash, it must end with a second slash and zero or more flags: '

type RegExBuilder = (literals: TemplateStringsArray, ...placeholders: (string | RegExp)[]) => RegExp
