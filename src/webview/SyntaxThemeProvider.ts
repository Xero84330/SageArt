import * as vscode from 'vscode';

export class SyntaxThemeProvider {

    constructor(
        private readonly extensionUri: vscode.Uri
    ) { }

    async open(style: string): Promise<void> {

        const fileMap: { [key: string]: string } = {
            'Syntax1': 'syntax1.json',
            'Syntax2': 'syntax2.json',
            'Syntax3': 'syntax3.json',
            'Syntax4': 'syntax4.json',
            'Sage Custom Syntax': 'sage-custom-syntax.json'
        };

        const fileName = fileMap[style];

        if (!fileName) {

            vscode.window.showErrorMessage(
                `Unknown syntax style: ${style}`
            );

            return;
        }

        try {

            const fileUri = vscode.Uri.joinPath(
                this.extensionUri,
                'syntax',
                fileName
            );

            const file =
                await vscode.workspace.fs.readFile(
                    fileUri
                );

            const theme =
                JSON.parse(
                    Buffer.from(file).toString('utf8')
                );

            await vscode.workspace
                .getConfiguration('editor')
                .update(
                    'tokenColorCustomizations',
                    {
                        textMateRules: theme.tokenColors
                    },
                    vscode.ConfigurationTarget.Global
                );

            vscode.window.showInformationMessage(
                `${style} applied.`
            );

        } catch (error) {

            vscode.window.showErrorMessage(
                `Failed to apply ${style}.`
            );

            console.error(error);
        }
    }
}