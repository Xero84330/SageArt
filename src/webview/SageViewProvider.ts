import * as vscode from 'vscode';
import { CustomThemeProvider } from './CostumThemeProvider';
import { SyntaxThemeProvider } from './SyntaxThemeProvider';
import { CostumSyntaxTheme } from './CostumSyntaxTheme';

export class SageViewProvider implements vscode.WebviewViewProvider {

    constructor(
        private readonly extensionUri: vscode.Uri
    ) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView
    ): void {

        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.onDidReceiveMessage(
            async message => {

                if (message.command === 'theme') {

                    await vscode.workspace
                        .getConfiguration('workbench')
                        .update(
                            'colorTheme',
                            message.name,
                            vscode.ConfigurationTarget.Global
                        );

                    return;
                }


                if (message.command === 'customTheme') {

                    const customThemeProvider =
                        new CustomThemeProvider(
                            this.extensionUri
                        );

                    customThemeProvider.open();

                    return;
                }


                if (message.command === 'syntaxTheme') {

                    const syntaxThemeProvider =
                        new SyntaxThemeProvider(
                            this.extensionUri
                        );

                    await syntaxThemeProvider.open(
                        message.name
                    );

                    return;
                }


                if (message.command === 'customSyntaxTheme') {

                    const costumSyntaxTheme =
                        new CostumSyntaxTheme(
                            this.extensionUri
                        );

                    costumSyntaxTheme.open();

                    return;
                }
            }
        );

        webviewView.webview.html =
            this.getHtml(webviewView.webview);
    }


    private getHtml(
        webview: vscode.Webview
    ): string {

        const cssUri =
            webview.asWebviewUri(
                vscode.Uri.joinPath(
                    this.extensionUri,
                    'src',
                    'webview',
                    'sage.css'
                )
            );

        const jsUri =
            webview.asWebviewUri(
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

                <link
                    rel="stylesheet"
                    href="${cssUri}"
                >

            </head>


            <body>

                <!-- Themes -->

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

                </div>


                <div class="section">

                    <button
                        class="custom-button"
                        onclick="createCustomTheme()"
                    >
                        <span class="icon">⚙</span>
                        Create Custom Theme
                    </button>

                </div>


                <!-- Syntax -->

                <div class="section">

                    <div class="section-title">
                        Choose Syntax Style
                    </div>


                    <div class="theme-grid">

                        <button
                            class="theme-button"
                            onclick="selectSyntaxTheme('Syntax1')"
                        >
                            Sage
                        </button>


                        <button
                            class="theme-button"
                            onclick="selectSyntaxTheme('Syntax2')"
                        >
                            Forest
                        </button>


                        <button
                            class="theme-button"
                            onclick="selectSyntaxTheme('Syntax3')"
                        >
                            Ocean
                        </button>


                        <button
                            class="theme-button"
                            onclick="selectSyntaxTheme('Syntax4')"
                        >
                            Sunset
                        </button>

                    </div>


                    <br>
                    <br>


                    <button
                        class="custom-button"
                        onclick="createCustomSyntaxTheme()"
                    >
                        <span class="icon">⚙</span>
                        Customize Syntax Colors
                    </button>

                </div>


                <script src="${jsUri}"></script>

            </body>

            </html>
        `;
    }
}