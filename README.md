# Test File Magic

## Features

**Test File Magic** helps you switch back and forth between source and test files. It can be customized to work with just many common patterns for organizing test files.

This is an open-source [VS Code](microsoft/vscode) extension created by [Herb Caudill](/herbcaudill).

## Configuration

By default, this extension assumes that your tests are organized like this:

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

Test File Magic offers these settings to adapt to the way you organize your tests.

| Name | Description | Default |
| --- | --- | --- |
| `testFileMagic.fileExtensions` | File extensions for source and test files (comma-separated). | `ts, js, tsx, jsx` |
| `testFileMagic.testKeyword` | Keyword for test filenames, inserted before the file extension. For example, if set to `spec`, the test file for `foo.ts` is `foo.spec.ts`. | `test` |
| `testFileMagic.sourceDirectory` | Name of the directory containing source files. | `src` |
| `testFileMagic.testDirectory` | Name of the directory (or directories) containing test files. If this is not set, each test file lives alongside its corresponding source file. | (not&nbsp;set) |
| `testFileMagic.testDirectoryLocation` | If `testFileMagic.testDirectory` is set, this indicates whether there is just one test directory or many:<ul><li>`root` Tests are stored in a single root-level test directory, with an internal directory structure mirroring the source directory's structure.</li><li>`alongside` Tests are stored in multiple test directories, each one alongside its corresponding source files.</li></ul> | `root` |
| `testFileMagic.testFileTemplate` | Template to use when creating a new test file for a module. |  |

Note that either `testFileMagic.testDirectory` or `testFileMagic.testKeyword` (or both) need to be set.

As with all settings, you can change these at the **workspace** level and/or at the **user** level.

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
