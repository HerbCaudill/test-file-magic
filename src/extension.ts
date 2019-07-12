import { config } from './lib/config'
import * as path from 'path'
import { getSourcePath, getTestPath } from './lib/paths'
import * as vscode from 'vscode'
import { switchFiles } from './switch'
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switch', (file: vscode.Uri) => {
      const workspaceConfig = vscode.workspace.getConfiguration('testFileMagic')

      const options = config({
        sourceDir: workspaceConfig.sourceDir,
        testDir: workspaceConfig.testDir,
        separateTestRoot: workspaceConfig.separateTestRoot === 'root',
        testKeyword: workspaceConfig.testKeyword,
        fileExtensions: workspaceConfig.fileExtensions.split(',').map((s: string) => s.trim),
      })

      if (!file && vscode.window.activeTextEditor)
        file = vscode.window.activeTextEditor.document.uri

      const filePath = vscode.workspace.asRelativePath(file.fsPath)

      const testPath = getTestPath(filePath, options)
      const sourcePath = getSourcePath(filePath, options)

      if (sourcePath !== undefined) {
        // this is a test file, go to source file
        vscode.workspace.openTextDocument(sourcePath)
      } else if (testPath !== undefined) {
        // this is a source file, go to test file
        vscode.workspace.openTextDocument(testPath)
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
