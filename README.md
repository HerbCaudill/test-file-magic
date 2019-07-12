# Test File Magic

Still to do:

- [ ] Wire up keyword replacement in template
- [ ] Create test file if doesn't exist
- [ ] Show computed regex
- [ ] Expose regex?
- [ ] Write readme

## Features

Lets you switch back and forth between source and test files

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and
configure them.

## Extension Settings

This extension contributes the following settings:

```json
"testFileMagic.sourceDirectory": {
  "type": "string",
  "default": "src",
  "markdownDescription": "Source directory name."
},
"testFileMagic.testDirectory": {
  "type": "string",
  "default": "tests",
  "markdownDescription": "Test directory name."
},
"testFileMagic.testDirectoryLocation": {
  "type": "string",
  "markdownDescription": "How are tests organized?",
  "enum": [
    "root",
    "alongside"
  ],
  "enumDescriptions": [
    "Tests are stored in a single root-level test directory, with an internal directory structure mirroring the source directory's structure.",
    "Tests are stored in multiple test directories, each one alongside its corresponding source files."
  ],
  "default": "root"
},
"testFileMagic.testKeyword": {
  "type": "string",
  "default": "test",
  "markdownDescription": "Keyword for test filenames, inserted before the file extension. For example, if set to `spec`, the test file for `foo.ts` is `foo.spec.ts`."
},
"testFileMagic.fileExtensions": {
  "type": "string",
  "default": "ts, js, tsx, jsx",
  "markdownDescription": "File extensions for source and test files (comma-separated)."
},
"testFileMagic.testFileTemplate": {
  "type": "array",
  "default": [
    "import {${moduleName}} from '${modulePath}'",
    "",
    "describe('${moduleName}', () => {",
    "  it('should work', () => {",
    "",
    "  })",
    "})"
  ],
  "markdownDescription": "Template for test files."
}
}
```

## Known Issues

## Release Notes
