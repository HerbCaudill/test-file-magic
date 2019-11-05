import * as fs from 'fs'
import * as path from 'path'
import { commands, window, workspace, ExtensionContext, Uri } from 'vscode'
import { switchFiles } from './lib/switchFiles'
import { populateTemplate } from './lib/populateTemplate'
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('testFileMagic.switch', (file: Uri) => {
      if (!file && window.activeTextEditor) file = window.activeTextEditor.document.uri

      const workspaceConfig = workspace.getConfiguration('testFileMagic')
      const currentFile = workspace.asRelativePath(file.fsPath)
      const workspaceRoot = workspace.rootPath || ''

      const { sourceFile, testFile } = switchFiles(currentFile, workspaceConfig)
      const targetFile = sourceFile || testFile
      if (targetFile) {
        const targetPath = path.join(workspaceRoot, targetFile)
        // create an empty test file if the file doesn't exist
        if (!fs.existsSync(targetPath)) {
          const fileContents = testFile
            ? populateTemplate(workspaceConfig.testFileTemplate, currentFile, testFile)
            : ''
          fs.writeFileSync(targetPath, fileContents)
        }
        // open the file
        window.showTextDocument(Uri.file(targetPath))
      } else
        window.showWarningMessage(
          `Test File Magic: The current file (${currentFile}) doesn't match the pattern for either a test file or a source file. Please check your settings.`
        )
    })
  )

  console.log('extension `test-file-magic` active')
}

export function deactivate() {}
