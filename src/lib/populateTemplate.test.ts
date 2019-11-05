import { getRelativePathToModule, populateTemplate } from './populateTemplate'

describe('getRelativePathToModule', () => {
  test('files in same directory', () => {
    const actual = getRelativePathToModule('populateTemplate.ts', 'populateTemplate.test.ts')
    expect(actual).toBe('./populateTemplate')
  })

  test('files in same directory, nested', () => {
    const actual = getRelativePathToModule(
      'foo/populateTemplate.ts',
      'foo/populateTemplate.test.ts'
    )
    expect(actual).toBe('./populateTemplate')
  })

  test('files in same directory, nested, backslashes', () => {
    const actual = getRelativePathToModule(
      'packages\\client\\src\\models\\user\\User.ts',
      'packages\\client\\src\\models\\user\\User.test.ts'
    )
    expect(actual).toBe('./User')
  })

  test('files in same directory, nested, mixed slashes', () => {
    const actual = getRelativePathToModule(
      'packages/client/src/models/user/User.ts',
      'packages\\client\\src\\models\\user\\User.test.ts'
    )
    expect(actual).toBe('./User')
  })

  test('source in parent directory', () => {
    const actual = getRelativePathToModule(
      './populateTemplate.ts',
      './tests/populateTemplate.test.ts'
    )
    expect(actual).toBe('../populateTemplate')
  })

  test('source in parent directory, nested', () => {
    const actual = getRelativePathToModule(
      'foo/populateTemplate.ts',
      'foo/tests/populateTemplate.test.ts'
    )
    expect(actual).toBe('../populateTemplate')
  })

  test('source in parallel directory', () => {
    const actual = getRelativePathToModule(
      'src/foo/populateTemplate.ts',
      'tests/foo/populateTemplate.test.ts'
    )
    expect(actual).toBe('../../src/foo/populateTemplate')
  })
})

describe('populateTemplate', () => {
  test('meta', () => {
    const template = [
      "import { ${moduleName} } from '${modulePath}'",
      '',
      "describe('${moduleName}', () => {",
      "  it('should work', () => {",
      '',
      '  })',
      '})',
    ]
    const actual = populateTemplate(template, 'populateTemplate.ts', 'populateTemplate.test.ts')
    expect(actual).toContain(`import { populateTemplate } from './populateTemplate'`)
    expect(actual).toContain(`describe('populateTemplate', () => {`)
  })
})
