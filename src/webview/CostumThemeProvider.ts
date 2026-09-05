import * as vscode from 'vscode';
import {
    ThemeGenerator,
    ThemeColors
} from './ThemeGenerator';

export class CustomThemeProvider {

    constructor(
        private readonly extensionUri: vscode.Uri
    ) { }

    open(): void {

        const panel = vscode.window.createWebviewPanel(
            'sage.customTheme',
            'Custom Theme',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    this.extensionUri
                ]
            }
        );

        panel.webview.html = this.getHtml(
            panel.webview
        );

        panel.webview.onDidReceiveMessage(
            async message => {

                if (message.command === 'applyTheme') {

                    try {

                        await this.applyTheme(
                            message.colors
                        );

                        vscode.window.showInformationMessage(
                            'Custom theme applied!'
                        );

                    } catch (error) {

                        vscode.window.showErrorMessage(
                            'Failed to apply custom theme.'
                        );

                        console.error(error);
                    }
                }
            }
        );
    }

    private async applyTheme(
        colors: ThemeColors
    ): Promise<void> {

        const generator =
            new ThemeGenerator();

        const theme =
            generator.generate(colors);

        const themeUri =
            vscode.Uri.joinPath(
                this.extensionUri,
                'themes',
                'sage-custom.json'
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
            .getConfiguration('workbench')
            .update(
                'colorTheme',
                'Sage Custom',
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
						color: var(--vscode-foreground);
						background: var(--vscode-editor-background);
						font-family: var(--vscode-font-family);
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
						color: var(--vscode-descriptionForeground);
						font-size: 13px;
						line-height: 1.5;
					}

					.section-title {
						font-size: 11px;
						font-weight: 600;
						text-transform: uppercase;
						letter-spacing: 0.8px;
						color: var(--vscode-descriptionForeground);
						margin-bottom: 12px;
					}

					.color-grid {
						display: grid;
						grid-template-columns: repeat(2, 1fr);
						gap: 12px;
					}

					.color-card {
						position: relative;
						display: flex;
						align-items: center;
						gap: 14px;
						padding: 14px;
						border: 1px solid var(--vscode-panel-border);
						border-radius: 10px;
						background: var(--vscode-sideBar-background);
						transition:
							border-color 0.12s ease,
							transform 0.12s ease;
					}

					.color-card:hover {
						border-color: var(--vscode-focusBorder);
						transform: translateY(-1px);
					}

					.color-preview {
						position: relative;
						width: 48px;
						height: 48px;
						flex-shrink: 0;
						border-radius: 8px;
						overflow: hidden;
						border: 1px solid rgba(255, 255, 255, 0.15);
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
	color: var(--vscode-descriptionForeground);
	font-size: 11px;
	line-height: 1.4;
	margin-bottom: 5px;
}

					.color-value {
						color: var(--vscode-descriptionForeground);
						font-family: var(--vscode-editor-font-family);
						font-size: 12px;
					}

					.actions {
						display: flex;
						justify-content: flex-end;
						margin-top: 30px;
					}

					.apply-button {
						padding: 10px 22px;
						border: 1px solid var(--vscode-button-border);
						border-radius: 7px;
						background: var(--vscode-button-background);
						color: var(--vscode-button-foreground);
						cursor: pointer;
						font-family: inherit;
						font-weight: 500;
						transition:
							transform 0.08s ease,
							background 0.08s ease;
					}

					.apply-button:hover {
						background: var(--vscode-button-hoverBackground);
					}

					.apply-button:active {
						transform: scale(0.96);
					}

					.apply-button:focus-visible {
						outline: 2px solid #FFFFFF;
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
							Custom Theme
						</div>

						<div class="subtitle">
							Choose your colors and let Sage build the rest.
						</div>

					</div>

					<div class="section-title">
						Theme Colors
					</div>

					<div class="color-grid">

${this.getColorInput(
            'editor',
            'Editor',
            '#0B1220',
            'Main background of your code editor.'
        )}

${this.getColorInput(
            'accent',
            'Accent',
            '#6EA8FF',
            'Highlights, selections, buttons, cursor, and active elements.'
        )}

${this.getColorInput(
            'secondary',
            'Secondary',
            '#9FD6B8',
            'Supporting color for strings, numbers, and subtle highlights.'
        )}

${this.getColorInput(
            'text',
            'Text',
            '#D6E4FF',
            'Main text color throughout the editor and interface.'
        )}

${this.getColorInput(
            'surface',
            'Surface',
            '#080D17',
            'Background for sidebars, panels, menus, and other UI areas.'
        )}

					</div>

					<div class="actions">

						<button
							class="apply-button"
							onclick="applyTheme()"
						>
							Apply Theme
						</button>

					</div>

				</div>

				<script>

					const vscode =
						acquireVsCodeApi();

					const colors = [
						'editor',
						'accent',
						'secondary',
						'text',
						'surface'
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

					function applyTheme() {

						const selectedColors = {

							editor:
								document.getElementById(
									'editor'
								).value,

							accent:
								document.getElementById(
									'accent'
								).value,

							secondary:
								document.getElementById(
									'secondary'
								).value,

							text:
								document.getElementById(
									'text'
								).value,

							surface:
								document.getElementById(
									'surface'
								).value

						};

						vscode.postMessage({

							command: 'applyTheme',

							colors: selectedColors

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