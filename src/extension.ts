import * as path from 'path'
import { commands, window, workspace, ExtensionContext, Uri } from 'vscode'
import { switchFiles } from './lib/switchFiles'
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('testFileMagic.switch', (file: Uri) => {
      if (!file && window.activeTextEditor) file = window.activeTextEditor.document.uri

      const workspaceConfig = workspace.getConfiguration('testFileMagic')
      const filePath = workspace.asRelativePath(file.fsPath)
      const workspaceRoot = workspace.rootPath || ''

      const fileToSwitchTo = switchFiles(filePath, workspaceConfig)

      window.showInformationMessage(`fileToSwitchTo: ${fileToSwitchTo}`)

      if (fileToSwitchTo)
        window.showTextDocument(Uri.file(path.join(workspaceRoot, fileToSwitchTo)))
      else
        window.showWarningMessage(
          `Test File Magic: The current file (${filePath}) doesn't match the pattern for either a test file or a source file. Please check your settings.`
        )
    })
  )

  console.log('extension `test-file-magic` active')
}

export function deactivate() {}
