import { stripComments, rex } from './rex'

describe('stripComments', () => {
  it('removes comments', () => expect(stripComments('.* # any')).toEqual('.*'))
  it('removes spaces', () => expect(stripComments('    .*    # any    ')).toEqual('.*'))
})

describe('rex', () => {
  it('supports composing regular expressions', () => {
    const RE_YEAR = /([0-9]{4})/
    const RE_MONTH = /([0-9]{2})/
    const RE_DAY = /([0-9]{2})/
    const RE_DATE = rex`/^${RE_YEAR}-${RE_MONTH}-${RE_DAY}$/u`
    expect(RE_DATE.source).toEqual('^([0-9]{4})-([0-9]{2})-([0-9]{2})$')
  })

  it('replaces ordinary strings', () => {
    const testKeyword = 'test'
    const ext = 'js|ts'
    const r = rex`/(?<filename>.*?)\.${testKeyword}\.(?<ext>${ext})/mi`
    expect(r.source).toEqual('(?<filename>.*?)\\.test\\.(?<ext>js|ts)')
  })

  it('removes newlines and excess whitespace', () => {
    const r = rex`/
      (?<path>.*?\\)?                      
      (?<filename>.*?)\.test\.(?<ext>ts|js) 
      /mi`
    expect(r.source).toEqual('(?<path>.*?\\\\)?(?<filename>.*?)\\.test\\.(?<ext>ts|js)')
  })

  it('removes comments', () => {
    const r = rex`/
      (?<path>.*?\\)?                       # path                                  
      (?<filename>.*?)\.test\.(?<ext>ts|js) # filename
      /mi`
    expect(r.source).toEqual('(?<path>.*?\\\\)?(?<filename>.*?)\\.test\\.(?<ext>ts|js)')
  })

  it('does it all', () => {
    const testKeyword = 'test'
    const ext = 'js|ts'
    const r = rex`/
      (?<path>.*?\\)?                                    # path
      (?<filename>.*?)\.${testKeyword}\.(?<ext>${ext}) # filename
      /mi`
    expect(r.source).toEqual('(?<path>.*?\\\\)?(?<filename>.*?)\\.test\\.(?<ext>js|ts)')
  })

  it('rejects mismatched slashes', () => {
    expect(() => rex`/abc`).toThrow()
  })

  it('works with flags', () => {
    const regexp1 = rex`/abc/gu`
    expect(regexp1 instanceof RegExp).toBe(true)
    expect(regexp1.source).toEqual('abc')
    expect(regexp1.flags).toEqual('gu')

    const regexp2 = rex`/xyz/`
    expect(regexp2 instanceof RegExp).toBe(true)
    expect(regexp2.source).toEqual('xyz')
    expect(regexp2.flags).toEqual('')
  })

  it('works with computed flags', () => {
    const regexp = rex`/abc/${'g' + 'u'}`
    expect(regexp instanceof RegExp).toBe(true)
    expect(regexp.source).toEqual('abc')
    expect(regexp.flags).toEqual('gu')
  })

  it('works in simple, flag-less mode', () => {
    const regexp = rex`abc`
    expect(regexp instanceof RegExp).toBe(true)
    expect(regexp.source).toEqual('abc')
    expect(regexp.flags).toEqual('')
  })

  it(`doesn't escape backticks`, () => {
    expect(rex`/^/$/u`.test('/')).toBe(true)
  })
})
