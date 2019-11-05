This is an open-source [VS Code](microsoft/vscode) extension created by [Herb Caudill](/herbcaudill).

## Why?

**Going back and forth between a test file and its source** is something that I do many, many times a day; and every time I do it, I have to think about where test files are stored relative to source files. It's a tiny bit of cognitive friction that I'd like to get rid of.

**Creating a test file** is also a chore. It's a tiny chore, to be sure, but it's also a distraction and a source of friction: I have to think about what naming convention we use, where it should be saved, and I have to put some boilerplate in place before I can start actually writing a test.

## Features

**Test File Magic** gets rid of that friction with a single keyboard shortcut, <kbd>alt+T</kbd> <kbd>alt+T</kbd>, to do all of those things:

- **From a test file**, press <kbd>alt+T</kbd> <kbd>alt+T</kbd> to jump to the corresponding source file.
- **From a source file**, press <kbd>alt+T</kbd> <kbd>alt+T</kbd> to jump to the test file.
- **If a test file doesn't exist, one is created** and scaffolded with the necessary boilerplate (importing the source module, creating a `describe` block, etc.)

![screenshot](test-file-magic.gif)

You can also invoke this command from the context menu: Right-click on a file and choose **Toggle Test ↔ Source** to jump from a source file to a test file. Do the same to jump back.

This command is also available from the command palette.

## Configuration

Different developers, teams, and projects organize their tests differently:

- Some put them side-by-side with source files; others gather them into a `tests` folder in each directory; still others put them in a root-level `tests` folder with a parallel file structure.
- Some insert a keyword like `test` or `spec` between the filename and extension (e.g. `foo.test.js`).

The Test File Magic extension can be customized to work with many common patterns for organizing test files.

By default, it assumes that your tests are organized like this:

```
📁 [workspace root]
    📁 src
        📄 index.js
        📄 index.test.js
        📄 foo.js
        📄 foo.test.js
        📁 lib
            📄 bar.js
            📄 bar.test.js
```

Test File Magic offers these settings:

| Name | Description | Default |
| --- | --- | --- |
| `testFileMagic.fileExtensions` | File extensions for source and test files (comma-separated). | `ts, js, tsx, jsx` |
| `testFileMagic.testKeyword` | Keyword for test filenames, inserted before the file extension. For example, if set to `spec`, the test file for `foo.ts` is `foo.spec.ts`. | `test` |
| `testFileMagic.sourceDirectory` | Name of the directory containing source files. | `src` |
| `testFileMagic.testDirectory` | Name of the directory (or directories) containing test files. If this is not set, each test file lives alongside its corresponding source file. | (not&nbsp;set) |
| `testFileMagic.testDirectoryLocation` | If `testFileMagic.testDirectory` is set, this indicates whether there is just one test directory or many:<ul><li>`root` Tests are stored in a single root-level test directory, with an internal directory structure mirroring the source directory's structure.</li><li>`alongside` Tests are stored in multiple test directories, each one alongside its corresponding source files.</li></ul> | `root` |
| `testFileMagic.testFileTemplate` | Template to use when creating a new test file for a module. (See [below](#customizing-the-template-for-new-test-files)) |  |

Note that either `testFileMagic.testDirectory` or `testFileMagic.testKeyword` (or both) need to be set.

As with all settings, you can change these at the **user** level, or at the **workspace** level so that you can adapt the extension's behavior to the file naming scheme used on each project you work on.

### Configuration examples

#### Tests identified with a different keyword

```
📁 [workspace root]
  📁 src
    📄 index.js
    📄 index.spec.js    🡸 custom keyword for tests (`spec` instead of `test`)
    📄 foo.js
    📄 foo.spec.js      🡸
    📁 lib
      📄 bar.js
      📄 bar.spec.js    🡸
```

```json
{
  "testFileMagic.testKeyword": "spec"
}
```

#### Tests in subdirectories

```
📁 [workspace root]
    📁 src
        📄 index.js
        📄 foo.js
        📁 tests                🡸 each folder has a `tests` subdirectory
            📄 index.test.js
            📄 foo.test.js
        📁 lib
            📄 bar.js
            📁 tests            🡸
                📄 bar.test.js
```

```json
{
  "testFileMagic.testDirectory": "tests",
  "testFileMagic.testDirectoryLocation": "alongside"
}
```

#### Tests in root-level directory

```
📁 [workspace root]
    📁 src
        📄 index.js
        📁 lib
            📄 bar.js
    📁 tests                    🡸 root-level `tests` directory with parallel file structure
        📄 index.test.js
        📁 lib
            📄 bar.test.js
```

```json
{
  "testFileMagic.testDirectory": "tests",
  "testFileMagic.testDirectoryLocation": "root"
}
```

#### Tests in root-level directory with no keyword

```
📁 [workspace root]
    📁 src
        📄 index.js
        📁 lib
            📄 bar.js
    📁 tests
        📄 index.js             🡸 test files don't include a `test` or `spec` keyword
        📁 lib
            📄 bar.js           🡸
```

```json
{
  "testFileMagic.testKeyword": "",
  "testFileMagic.testDirectory": "tests",
  "testFileMagic.testDirectoryLocation": "root"
}
```

### Cutomizing the template for new test files

If you try to go to a test file that doesn't exist, the file will be created. For example, if you are in an untested file called `foo.ts` and you invoke this extension, you'll get a new file like this:

<!-- prettier-ignore -->
```ts
import { foo } from './foo'

describe('foo', () => {
  it('should work', () => {
    
  })
})
```

This template is defined in settings as an array of strings.

```json
[
  "import { ${moduleName} } from '${modulePath}'",
  "",
  "describe('${moduleName}', () => {",
  "  it('should work', () => {",
  "",
  "  })",
  "})"
]
```

- `${moduleName}` will be replaced the current filename, without the extension.
- `${modulePath}` will be replaced with the relative path from the new test file to the source file.
