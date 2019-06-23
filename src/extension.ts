import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('extension `test-file-magic` active')

  let disposable = vscode.commands.registerCommand('extension.switch', (sourceFile: vscode.Uri) => {
    vscode.window.showInformationMessage('Hello')
    // vscode.window.showInformationMessage(`Hello ${sourceFile.path}`)
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
