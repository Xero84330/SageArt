const vscode = acquireVsCodeApi();


function selectTheme(name) {

    vscode.postMessage({
        command: 'theme',
        name: name
    });

}


function createCustomTheme() {

    vscode.postMessage({
        command: 'customTheme'
    });

}


function selectSyntaxTheme(name) {

    vscode.postMessage({
        command: 'syntaxTheme',
        name: name
    });

}


function createCustomSyntaxTheme() {

    vscode.postMessage({
        command: 'customSyntaxTheme'
    });

}
