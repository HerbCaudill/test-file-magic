const MSG_MISMATCHED_SLASH =
  'If the `re` string starts with a slash, it must end with a second slash and zero or more flags: '

type RegExBuilder = (literals: TemplateStringsArray, ...placeholders: (string | RegExp)[]) => RegExp

export const rex: RegExBuilder = (literals, ...placeholders) => {
  const rawLiterals = literals.raw.map(collapseFreespace)
  const s =
    rawLiterals[0] +
    placeholders.map((p, i) => (p instanceof RegExp ? p.source : p) + rawLiterals[i + 1]).join('')
  const { source, flags } = parse(s)
  return new RegExp(source, flags)
}

// breaks a string into regex source and flags
// /(.*)/gi -> {source: '(.*)', flags: 'gi'}
// (.*) -> {source: '(.*)'}
const parse = (s: string) => {
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

const collapseFreespace = (s: string) =>
  s
    .split('\n')
    .map(stripComments)
    .join('')

export const stripComments = (s: string) => s.replace(/(#.*)/, '').trim()
