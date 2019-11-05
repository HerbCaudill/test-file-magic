import { populateTemplate } from './populateTemplate'

const template = [
  "import { ${moduleName} } from '${modulePath}'",
  '',
  "describe('${moduleName}', () => {",
  "  it('should work', () => {",
  '',
  '  })',
  '})',
]

describe('populateTemplate', () => {
  it('getting all meta up in here', () => {
    const actual = populateTemplate(template, 'populateTemplate.ts', 'populateTemplate.test.ts')
    expect(actual).toContain(`import { populateTemplate } from '..\\populateTemplate'`)
    expect(actual).toContain(`describe('populateTemplate', () => {`)
  })
})
