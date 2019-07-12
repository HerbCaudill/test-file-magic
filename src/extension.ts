import { config } from './lib/config'
import * as path from 'path'
import { getSourcePath, getTestPath } from './lib/paths'
import * as vscode from 'vscode'
import { switchFiles } from './switch'
import { Uri } from 'vscode'
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switch', (file: vscode.Uri) => {
      const workspaceConfig = vscode.workspace.getConfiguration('testFileMagic')

      // User can't set things to `undefined` in the UI, so we treat empty strings as undefined so
      // the `config` function's defaults will kick in.
      const emptyAsUndefined = (s: string | undefined) => (s === '' ? undefined : s)

      const settings = {
        sourceDir: emptyAsUndefined(workspaceConfig.sourceDirectory),
        testDir: workspaceConfig.testDirectory,
        testKeyword: emptyAsUndefined(workspaceConfig.testKeyword),
        separateTestRoot: workspaceConfig.testDirectoryLocation === 'root',
        fileExtensions: workspaceConfig.fileExtensions.split(','),
      }

      const options = config(settings)

      if (!file && vscode.window.activeTextEditor)
        file = vscode.window.activeTextEditor.document.uri

      const filePath = vscode.workspace.asRelativePath(file.fsPath)
      const workspaceRoot = vscode.workspace.rootPath || ''

      const testPath = getTestPath(filePath, options)
      const sourcePath = getSourcePath(filePath, options)

      if (sourcePath !== undefined) {
        // this is a test file, go to source file
        vscode.window.showTextDocument(Uri.file(path.join(workspaceRoot, sourcePath)))
      } else if (testPath !== undefined) {
        // this is a source file, go to test file
        vscode.window.showTextDocument(Uri.file(path.join(workspaceRoot, testPath)))
      } else {
        vscode.window.showWarningMessage(
          `Test File Magic: The current file (${filePath}) doesn'match the pattern for either a test file or a source file. Please check your settings.`
        )
      }
      // const filePath = vscode.workspace.asRelativePath(file.fsPath)
    })
  )

  // context.subscriptions.push(
  //   vscode.commands.registerCommand('testFileMagic.switchToTest', (sourceFile: vscode.Uri) => {
  //     vscode.window.showInformationMessage('switchToTest')
  //     console.log(JSON.stringify(sourceFile))
  //     vscode.window.showInformationMessage(`switch to source from ${sourceFile.path}`)
  //   })
  // )

  // context.subscriptions.push(
  //   vscode.commands.registerCommand('testFileMagic.switchToSource', (sourceFile: vscode.Uri) => {
  //     vscode.window.showInformationMessage('switchToSource')
  //     console.log(JSON.stringify(sourceFile))
  //     vscode.window.showInformationMessage(`switch to source from ${sourceFile.path}`)
  //   })
  // )

  console.log('extension `test-file-magic` active')
}

export function deactivate() {}
