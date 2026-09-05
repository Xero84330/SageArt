import * as vscode from 'vscode';

export class CostumSyntaxTheme {

    constructor(
        private readonly extensionUri: vscode.Uri
    ) { }

    open(): void {

        const panel = vscode.window.createWebviewPanel(
            'sage.customSyntaxTheme',
            'Custom Syntax Theme',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.getHtml(
            panel.webview
        );

        panel.webview.onDidReceiveMessage(
            async message => {

                if (message.command === 'applySyntaxTheme') {

                    try {

                        await this.applySyntaxTheme(
                            message.colors
                        );

                        vscode.window.showInformationMessage(
                            'Custom syntax theme applied!'
                        );

                    } catch (error) {

                        vscode.window.showErrorMessage(
                            'Failed to apply custom syntax theme.'
                        );

                        console.error(error);
                    }
                }
            }
        );
    }


    private async applySyntaxTheme(
        colors: {
            keyword: string;
            function: string;
            type: string;
            string: string;
            comment: string;
        }
    ): Promise<void> {

        const tokenColors = [

            // Comments

            {
                scope: [
                    'comment',
                    'punctuation.definition.comment'
                ],

                settings: {
                    foreground: colors.comment
                }
            },


            // Keywords

            {
                scope: [
                    'keyword',
                    'storage',
                    'storage.type',
                    'storage.modifier'
                ],

                settings: {
                    foreground: colors.keyword
                }
            },


            // Functions

            {
                scope: [
                    'entity.name.function',
                    'support.function',
                    'meta.function-call'
                ],

                settings: {
                    foreground: colors.function
                }
            },


            // Types / Classes

            {
                scope: [
                    'entity.name.type',
                    'entity.name.class',
                    'support.type',
                    'support.class'
                ],

                settings: {
                    foreground: colors.type
                }
            },


            // Strings

            {
                scope: [
                    'string',
                    'string.quoted',
                    'string.template'
                ],

                settings: {
                    foreground: colors.string
                }
            }
        ];


        const theme = {
            name: 'Sage Custom Syntax',
            tokenColors: tokenColors
        };


        const themeUri =
            vscode.Uri.joinPath(
                this.extensionUri,
                'syntax',
                'sage-custom-syntax.json'
            );


        const data = Buffer.from(
            JSON.stringify(
                theme,
                null,
                2
            ),
            'utf8'
        );


        await vscode.workspace.fs.writeFile(
            themeUri,
            data
        );


        await vscode.workspace
            .getConfiguration('editor')
            .update(
                'tokenColorCustomizations',
                {
                    textMateRules: tokenColors
                },
                vscode.ConfigurationTarget.Global
            );
    }


    private getHtml(
        webview: vscode.Webview
    ): string {

        return `
            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

                <style>

                    * {
                        box-sizing: border-box;
                    }


                    body {
                        margin: 0;
                        padding: 40px;

                        color:
                            var(--vscode-foreground);

                        background:
                            var(--vscode-editor-background);

                        font-family:
                            var(--vscode-font-family);

                        font-size: 13px;
                    }


                    .container {
                        max-width: 850px;
                        margin: 0 auto;
                    }


                    .header {
                        margin-bottom: 35px;
                    }


                    .title {
                        font-size: 28px;
                        font-weight: 600;
                        letter-spacing: -0.5px;
                        margin-bottom: 8px;
                    }


                    .subtitle {
                        color:
                            var(--vscode-descriptionForeground);

                        font-size: 13px;
                        line-height: 1.5;
                    }


                    .section-title {
                        font-size: 11px;
                        font-weight: 600;

                        text-transform: uppercase;

                        letter-spacing: 0.8px;

                        color:
                            var(--vscode-descriptionForeground);

                        margin-bottom: 12px;
                    }


                    .color-grid {
                        display: grid;

                        grid-template-columns:
                            repeat(2, 1fr);

                        gap: 12px;
                    }


                    .color-card {
                        position: relative;

                        display: flex;

                        align-items: center;

                        gap: 14px;

                        padding: 14px;

                        border:
                            1px solid
                            var(--vscode-panel-border);

                        border-radius: 10px;

                        background:
                            var(--vscode-sideBar-background);

                        transition:
                            border-color 0.12s ease,
                            transform 0.12s ease;
                    }


                    .color-card:hover {
                        border-color:
                            var(--vscode-focusBorder);

                        transform:
                            translateY(-1px);
                    }


                    .color-preview {
                        position: relative;

                        width: 48px;
                        height: 48px;

                        flex-shrink: 0;

                        border-radius: 8px;

                        overflow: hidden;

                        border:
                            1px solid
                            rgba(255, 255, 255, 0.15);
                    }


                    input[type="color"] {
                        position: absolute;

                        inset: 0;

                        width: 100%;
                        height: 100%;

                        padding: 0;

                        border: none;

                        opacity: 0;

                        cursor: pointer;
                    }


                    .color-info {
                        min-width: 0;
                    }


                    .color-name {
                        font-weight: 500;
                        margin-bottom: 4px;
                    }


                    .color-description {
                        color:
                            var(--vscode-descriptionForeground);

                        font-size: 11px;

                        line-height: 1.4;

                        margin-bottom: 5px;
                    }


                    .color-value {
                        color:
                            var(--vscode-descriptionForeground);

                        font-family:
                            var(--vscode-editor-font-family);

                        font-size: 12px;
                    }


                    .actions {
                        display: flex;

                        justify-content: flex-end;

                        margin-top: 30px;
                    }


                    .apply-button {
                        padding: 10px 22px;

                        border:
                            1px solid
                            var(--vscode-button-border);

                        border-radius: 7px;

                        background:
                            var(--vscode-button-background);

                        color:
                            var(--vscode-button-foreground);

                        cursor: pointer;

                        font-family: inherit;

                        font-weight: 500;

                        transition:
                            transform 0.08s ease,
                            background 0.08s ease;
                    }


                    .apply-button:hover {
                        background:
                            var(--vscode-button-hoverBackground);
                    }


                    .apply-button:active {
                        transform:
                            scale(0.96);
                    }


                    .apply-button:focus-visible {
                        outline:
                            2px solid #FFFFFF;

                        outline-offset: 2px;
                    }


                    @media (max-width: 600px) {

                        body {
                            padding: 25px;
                        }


                        .color-grid {
                            grid-template-columns: 1fr;
                        }

                    }

                </style>

            </head>


            <body>

                <div class="container">

                    <div class="header">

                        <div class="title">
                            Custom Syntax Colors
                        </div>

                        <div class="subtitle">
                            Choose your colors and let Sage build the syntax style.
                        </div>

                    </div>


                    <div class="section-title">
                        Syntax Colors
                    </div>


                    <div class="color-grid">

                        ${this.getColorInput(
            'keyword',
            'Keyword',
            '#7FB069',
            'if, else, return, class, and other language keywords.'
        )}


                        ${this.getColorInput(
            'function',
            'Function',
            '#5DADE2',
            'Functions and methods in your code.'
        )}


                        ${this.getColorInput(
            'type',
            'Type',
            '#48C9B0',
            'Classes, types, interfaces, and related declarations.'
        )}


                        ${this.getColorInput(
            'string',
            'String',
            '#A8C66C',
            'Text and string literals inside your code.'
        )}


                        ${this.getColorInput(
            'comment',
            'Comment',
            '#7F8C8D',
            'Comments and documentation in your code.'
        )}

                    </div>


                    <div class="actions">

                        <button
                            class="apply-button"
                            onclick="applySyntaxTheme()"
                        >
                            Apply Syntax Theme
                        </button>

                    </div>

                </div>


                <script>

                    const vscode =
                        acquireVsCodeApi();


                    const colors = [
                        'keyword',
                        'function',
                        'type',
                        'string',
                        'comment'
                    ];


                    colors.forEach(name => {

                        const input =
                            document.getElementById(name);

                        const preview =
                            document.getElementById(
                                name + 'Preview'
                            );

                        const value =
                            document.getElementById(
                                name + 'Value'
                            );


                        input.addEventListener(
                            'input',
                            () => {

                                preview.style.background =
                                    input.value;

                                value.textContent =
                                    input.value.toUpperCase();

                            }
                        );

                    });


                    function applySyntaxTheme() {

                        const selectedColors = {

                            keyword:
                                document.getElementById(
                                    'keyword'
                                ).value,

                            function:
                                document.getElementById(
                                    'function'
                                ).value,

                            type:
                                document.getElementById(
                                    'type'
                                ).value,

                            string:
                                document.getElementById(
                                    'string'
                                ).value,

                            comment:
                                document.getElementById(
                                    'comment'
                                ).value

                        };


                        vscode.postMessage({

                            command:
                                'applySyntaxTheme',

                            colors:
                                selectedColors

                        });

                    }

                </script>

            </body>

            </html>
        `;
    }


    private getColorInput(
        id: string,
        name: string,
        value: string,
        description: string
    ): string {

        return `
            <div class="color-card">

                <div
                    class="color-preview"
                    id="${id}Preview"
                    style="background: ${value};"
                >

                    <input
                        type="color"
                        id="${id}"
                        value="${value}"
                    >

                </div>


                <div class="color-info">

                    <div class="color-name">
                        ${name}
                    </div>


                    <div class="color-description">
                        ${description}
                    </div>


                    <div
                        class="color-value"
                        id="${id}Value"
                    >
                        ${value}
                    </div>

                </div>

            </div>
        `;
    }
}