import * as vscode from 'vscode';
import { CustomThemeProvider } from './CostumThemeProvider';

export class SageViewProvider implements vscode.WebviewViewProvider {

    constructor(private readonly extensionUri: vscode.Uri) { }

    resolveWebviewView(webviewView: vscode.WebviewView): void {

        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.onDidReceiveMessage(async message => {

            if (message.command === 'theme') {
                await vscode.workspace
                    .getConfiguration('workbench')
                    .update(
                        'colorTheme',
                        message.name,
                        vscode.ConfigurationTarget.Global
                    );
            }

            if (message.command === 'customTheme') {
                const customThemeProvider = new CustomThemeProvider(
                    this.extensionUri
                );

                customThemeProvider.open();
            }
        });

        webviewView.webview.html = this.getHtml(webviewView.webview);
    }

    private getHtml(webview: vscode.Webview): string {

        const cssUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.extensionUri,
                'src',
                'webview',
                'sage.css'
            )
        );

        const jsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.extensionUri,
                'src',
                'webview',
                'sage.js'
            )
        );

        return `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				>
				<link rel="stylesheet" href="${cssUri}">
			</head>

			<body>

				<div class="section">

					<div class="section-title">
						Select Theme
					</div>

					<div class="theme-grid">

						<button
							class="theme-button"
							onclick="selectTheme('Theme 1')"
						>
							Sapphire
						</button>

						<button
							class="theme-button"
							onclick="selectTheme('Theme 2')"
						>
							Emerland
						</button>

						<button
							class="theme-button"
							onclick="selectTheme('Theme 3')"
						>
							Onyx
						</button>

						<button
							class="theme-button"
							onclick="selectTheme('Theme 4')"
						>
							Amethyst
						</button>

					</div>
                    <div class="section">

                    <br/>
                    <br/>
                    

	<div class="section-title">
		Customization
	</div>

	<button
		class="custom-button"
		onclick="createCustomTheme()"
	>
		<span class="icon">⚙</span>
		Create Custom Theme
	</button>

</div>

				</div>

				<script src="${jsUri}"></script>

			</body>
			</html>
		`;
    }
}