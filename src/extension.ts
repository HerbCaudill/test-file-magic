import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switch', (sourceFile: vscode.Uri) => {
      vscode.window.showInformationMessage('switch')
      console.log(JSON.stringify(sourceFile))
      vscode.window.showInformationMessage(`switch to source from ${sourceFile.path}`)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switchToTest', (sourceFile: vscode.Uri) => {
      vscode.window.showInformationMessage('switchToTest')
      console.log(JSON.stringify(sourceFile))
      vscode.window.showInformationMessage(`switch to source from ${sourceFile.path}`)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('testFileMagic.switchToSource', (sourceFile: vscode.Uri) => {
      vscode.window.showInformationMessage('switchToSource')
      console.log(JSON.stringify(sourceFile))
      vscode.window.showInformationMessage(`switch to source from ${sourceFile.path}`)
    })
  )

  console.log('extension `test-file-magic` active')
}

export function deactivate() {}
