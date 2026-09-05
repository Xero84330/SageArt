import * as assert from 'assert';
import * as vscode from 'vscode';
import { ThemeGenerator, ThemeColors } from '../webview/ThemeGenerator';

suite('Sage Extension Test Suite', () => {

	suite('Extension & Commands', () => {
		test('Commands are registered', async () => {
			const commands = await vscode.commands.getCommands(true);
			assert.ok(commands.includes('sage.osho'), 'sage.osho command should be registered');
		});
	});

	suite('Theme Generator Engine', () => {
		test('ThemeGenerator builds valid theme object with tokenColors and UI colors', () => {
			const generator = new ThemeGenerator();
			const inputColors: ThemeColors = {
				editor: '#0B1220',
				accent: '#6EA8FF',
				secondary: '#9FD6B8',
				text: '#D6E4FF',
				surface: '#080D17'
			};

			const generated: any = generator.generate(inputColors);

			assert.strictEqual(generated.name, 'Sage Custom');
			assert.ok(generated.colors, 'Should have colors object');
			assert.strictEqual(generated.colors['editor.background'], '#0B1220');
			assert.strictEqual(generated.colors['editor.foreground'], '#D6E4FF');
			assert.ok(Array.isArray(generated.tokenColors), 'Should have tokenColors array');
			assert.ok(generated.tokenColors.length > 0, 'tokenColors should not be empty');
		});

		test('ThemeGenerator handles high/low brightness and contrast calculation', () => {
			const generator = new ThemeGenerator();
			const lightInput: ThemeColors = {
				editor: '#ffffff',
				accent: '#ffffff',
				secondary: '#ffffff',
				text: '#000000',
				surface: '#f0f0f0'
			};

			const generated: any = generator.generate(lightInput);
			assert.ok(generated.colors['button.foreground'], 'Should calculate contrast color for button');
		});
	});

	suite('Themes and Syntax Files Verification', () => {
		const extension = vscode.extensions.getExtension('undefined_publisher.sage') || 
		                  vscode.extensions.all.find(e => e.id.endsWith('.sage'));

		test('All 4 default themes and sage-custom.json exist and are valid JSON', async () => {
			if (!extension) {
				return;
			}
			const themeFiles = ['theme1.json', 'theme2.json', 'theme3.json', 'theme4.json', 'sage-custom.json'];
			for (const fileName of themeFiles) {
				const fileUri = vscode.Uri.joinPath(extension.extensionUri, 'themes', fileName);
				const data = await vscode.workspace.fs.readFile(fileUri);
				const content = Buffer.from(data).toString('utf8');
				const parsed = JSON.parse(content);
				assert.ok(parsed, `${fileName} should be valid JSON`);
			}
		});

		test('All 4 default syntax files and sage-custom-syntax.json exist and are valid JSON', async () => {
			if (!extension) {
				return;
			}
			const syntaxFiles = ['syntax1.json', 'syntax2.json', 'syntax3.json', 'syntax4.json', 'sage-custom-syntax.json'];
			for (const fileName of syntaxFiles) {
				const fileUri = vscode.Uri.joinPath(extension.extensionUri, 'syntax', fileName);
				const data = await vscode.workspace.fs.readFile(fileUri);
				const content = Buffer.from(data).toString('utf8');
				const parsed = JSON.parse(content);
				assert.ok(parsed.tokenColors, `${fileName} should contain tokenColors`);
			}
		});
	});
});

