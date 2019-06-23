import { config, InternalConfig, Config } from './config'
import { getSource, getTest } from './paths'

const t = (fn = getTest, s: string, exp: string, opts: Config = {}): void => {
  const internalConfig: InternalConfig = config(opts)
  test(`${s} -> ${exp}`, () => expect(fn(s, internalConfig)).toEqual(exp))
}

describe('default options', () => {
  describe('getTest', () => {
    t(getTest, 'foo.ts', 'foo.test.ts')
    t(getTest, 'src\\foo.ts', 'src\\foo.test.ts')
    t(getTest, 'src\\foo.js', 'src\\foo.test.js')
    t(getTest, 'src\\foo.jsx', 'src\\foo.test.jsx')
    t(getTest, 'src\\foo.tsx', 'src\\foo.test.tsx')
    t(getTest, 'src\\foo.bar.ts', 'src\\foo.bar.test.ts')
    t(getTest, 'src/foo.bar.ts', 'src\\foo.bar.test.ts')
  })

  describe('getSource', () => {
    t(getSource, 'foo.test.ts', 'foo.ts')
    t(getSource, 'src\\foo.test.ts', 'src\\foo.ts')
    t(getSource, 'src\\foo.bar.test.ts', 'src\\foo.bar.ts')
    t(getSource, 'src/foo.bar.test.ts', 'src\\foo.bar.ts')
  })
})

//   describe.skip('custom dirs, extensions, paths', () => {
//     const opts = {
//       sourceRoot: 'source',
//       testRoot: '__tests__',
//       extensions: ['js', 'jsx'],
//     }
//     t(getTest, 'foo.ts', 'foo.test.ts', opts)
//     t(getTest, 'src\\foo.ts', 'src\\foo.test.ts', opts)
//     t(getTest, 'src\\foo.js', 'src\\foo.test.js', opts)
//     t(getTest, 'src\\foo.jsx', 'src\\foo.test.jsx', opts)
//     t(getTest, 'src\\foo.tsx', 'src\\foo.test.tsx', opts)
//     t(getTest, 'src\\foo.bar.ts', 'src\\foo.bar.test.ts', opts)
//     t(getTest, 'src/foo.bar.ts', 'src\\foo.bar.test.ts', opts)
//   })
