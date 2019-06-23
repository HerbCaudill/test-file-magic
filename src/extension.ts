import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switch', (sourceFile: vscode.Uri) => {
      vscode.window.showInformationMessage('switch')
      // vscode.window.showInformationMessage(`Hello ${sourceFile.path}`)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switchToTest', (sourceFile: vscode.Uri) => {
      vscode.window.showInformationMessage('switchToTest')
      // vscode.window.showInformationMessage(`Hello ${sourceFile.path}`)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switchToSource', (sourceFile: vscode.Uri) => {
      vscode.window.showInformationMessage('switchToSource')
      // vscode.window.showInformationMessage(`Hello ${sourceFile.path}`)
    })
  )

  console.log('extension `test-file-magic` active')
}

export function deactivate() {}
