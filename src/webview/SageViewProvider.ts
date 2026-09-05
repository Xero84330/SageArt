import * as vscode from 'vscode';
import { CustomThemeProvider } from './CostumThemeProvider';
import { SyntaxThemeProvider } from './SyntaxThemeProvider';
import { CostumSyntaxTheme } from './CostumSyntaxTheme';

export class SageViewProvider implements vscode.WebviewViewProvider {

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView
    ): void {

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this.context.extensionUri
            ]
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

                    await vscode.workspace
                        .getConfiguration('workbench')
                        .update(
                            'colorCustomizations',
                            undefined,
                            vscode.ConfigurationTarget.Global
                        );

                    await vscode.workspace
                        .getConfiguration('editor')
                        .update(
                            'tokenColorCustomizations',
                            undefined,
                            vscode.ConfigurationTarget.Global
                        );

                    return;
                }

                if (message.command === 'customTheme') {

                    const customThemeProvider =
                        new CustomThemeProvider(
                            this.context
                        );

                    customThemeProvider.open();

                    return;
                }

                if (message.command === 'syntaxTheme') {

                    const syntaxThemeProvider =
                        new SyntaxThemeProvider(
                            this.context.extensionUri
                        );

                    await syntaxThemeProvider.open(
                        message.name
                    );

                    return;
                }

                if (message.command === 'customSyntaxTheme') {

                    const costumSyntaxTheme =
                        new CostumSyntaxTheme(
                            this.context
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
                    this.context.extensionUri,
                    'media',
                    'sage.css'
                )
            );

        const jsUri =
            webview.asWebviewUri(
                vscode.Uri.joinPath(
                    this.context.extensionUri,
                    'media',
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

                    <div class="section-header">
                        <span class="section-title">Select Theme</span>

                        <div class="info-wrapper">

                            <button
                                class="info-btn"
                                aria-label="Theme Info"
                                tabindex="0"
                            >
                                i
                            </button>

                            <div class="info-tooltip">
                                Changes the entire IDE appearance including editor, sidebars, activity bar, and panels.
                            </div>

                        </div>
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
                            Emerald
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

                    <div style="margin-top: 10px;">

                        <button
                            class="custom-button"
                            onclick="createCustomTheme()"
                        >
                            <span class="icon">⚙</span>
                            Create Custom Theme
                        </button>

                    </div>

                </div>

                <!-- Syntax -->

                <div class="section">

                    <div class="section-header">
                        <span class="section-title">Choose Syntax Style</span>

                        <div class="info-wrapper">

                            <button
                                class="info-btn"
                                aria-label="Syntax Info"
                                tabindex="0"
                            >
                                i
                            </button>

                            <div class="info-tooltip">
                                Customizes code syntax highlighting such as keywords, functions, types, strings, and comments.
                            </div>

                        </div>
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

                    <div style="margin-top: 10px;">

                        <button
                            class="custom-button"
                            onclick="createCustomSyntaxTheme()"
                        >
                            <span class="icon">⚙</span>
                            Customize Syntax Colors
                        </button>

                    </div>

                </div>

                <script src="${jsUri}"></script>

            </body>

            </html>
        `;
    }
}