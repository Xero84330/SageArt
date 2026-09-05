import * as vscode from 'vscode';
import { SageViewProvider } from './webview/SageViewProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "sage" is now active!');

	const disposable = vscode.commands.registerCommand('sage.osho', () => {
		vscode.window.showInformationMessage(
			'Wisdom of Osho awaits you my child!'
		);
	});

	context.subscriptions.push(disposable);

	const sageViewProvider = new SageViewProvider(
		context.extensionUri
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'sage.main',
			sageViewProvider
		)
	);
}

export function deactivate() {}