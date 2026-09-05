export interface ThemeColors {
	editor: string;
	accent: string;
	secondary: string;
	text: string;
	surface: string;
}

export class ThemeGenerator {

	generate(colors: ThemeColors): object {

		const editorDark = this.adjustLightness(
			colors.editor,
			-5
		);

		const editorLight = this.adjustLightness(
			colors.editor,
			5
		);

		const surfaceDark = this.adjustLightness(
			colors.surface,
			-5
		);

		const surfaceLight = this.adjustLightness(
			colors.surface,
			6
		);

		const accentLight = this.adjustLightness(
			colors.accent,
			10
		);

		const accentDark = this.adjustLightness(
			colors.accent,
			-10
		);

		const secondaryLight = this.adjustLightness(
			colors.secondary,
			10
		);

		const secondaryDark = this.adjustLightness(
			colors.secondary,
			-10
		);

		const mutedText = this.adjustLightness(
			colors.text,
			-30
		);

		return {

			name: 'Sage Custom',

			colors: {

				// Editor

				'editor.background':
					colors.editor,

				'editor.foreground':
					colors.text,

				'editorLineNumber.foreground':
					mutedText,

				'editorLineNumber.activeForeground':
					accentLight,

				'editorCursor.foreground':
					colors.accent,

				'editor.selectionBackground':
					this.alpha(
						colors.accent,
						'55'
					),

				'editor.inactiveSelectionBackground':
					this.alpha(
						colors.accent,
						'30'
					),

				'editor.findMatchBackground':
					this.alpha(
						colors.accent,
						'66'
					),

				// Activity Bar

				'activityBar.background':
					surfaceDark,

				'activityBar.foreground':
					colors.text,

				'activityBar.activeBorder':
					colors.accent,

				'activityBar.inactiveForeground':
					mutedText,

				// Sidebar

				'sideBar.background':
					colors.surface,

				'sideBar.foreground':
					colors.text,

				'sideBarSectionHeader.background':
					surfaceLight,

				// Title Bar

				'titleBar.activeBackground':
					surfaceDark,

				'titleBar.activeForeground':
					colors.text,

				// Status Bar

				'statusBar.background':
					surfaceDark,

				'statusBar.foreground':
					colors.text,

				'statusBarItem.hoverBackground':
					surfaceLight,

				// Buttons

				'button.background':
					colors.accent,

				'button.foreground':
					this.getContrastColor(
						colors.accent
					),

				'button.hoverBackground':
					accentLight,

				// Inputs

				'input.background':
					surfaceLight,

				'input.foreground':
					colors.text,

				'input.border':
					accentDark,

				// Focus

				'focusBorder':
					colors.accent,

				// Lists

				'list.activeSelectionBackground':
					this.alpha(
						colors.accent,
						'55'
					),

				'list.activeSelectionForeground':
					colors.text,

				'list.hoverBackground':
					this.alpha(
						colors.secondary,
						'25'
					),

				// Panels

				'panel.background':
					colors.surface,

				'panel.border':
					this.alpha(
						colors.text,
						'20'
					),

				// Terminal

				'terminal.background':
					editorDark,

				'terminal.foreground':
					colors.text
			},

			tokenColors: [

				{
					scope: [
						'comment',
						'punctuation.definition.comment'
					],
					settings: {
						foreground:
							mutedText
					}
				},

				{
					scope: [
						'keyword',
						'storage',
						'storage.type'
					],
					settings: {
						foreground:
							colors.accent
					}
				},

				{
					scope: [
						'string',
						'constant.other.symbol'
					],
					settings: {
						foreground:
							colors.secondary
					}
				},

				{
					scope: [
						'constant.numeric',
						'constant.language'
					],
					settings: {
						foreground:
							secondaryLight
					}
				},

				{
					scope: [
						'entity.name.function',
						'support.function'
					],
					settings: {
						foreground:
							colors.text
					}
				},

				{
					scope: [
						'entity.name.type',
						'entity.name.class'
					],
					settings: {
						foreground:
							accentLight
					}
				},

				{
					scope: [
						'variable',
						'variable.other'
					],
					settings: {
						foreground:
							this.adjustLightness(
								colors.text,
								-5
							)
					}
				},

				{
					scope: [
						'constant',
						'constant.other'
					],
					settings: {
						foreground:
							secondaryDark
					}
				}
			]
		};
	}

	// -----------------------------
	// HSL COLOR ENGINE
	// -----------------------------

	private adjustLightness(
		hex: string,
		amount: number
	): string {

		const hsl = this.hexToHsl(hex);

		if (!hsl) {
			return hex;
		}

		hsl.l = Math.max(
			0,
			Math.min(
				100,
				hsl.l + amount
			)
		);

		return this.hslToHex(
			hsl.h,
			hsl.s,
			hsl.l
		);
	}

	private hexToHsl(
		hex: string
	): {
		h: number;
		s: number;
		l: number;
	} | null {

		const rgb = this.hexToRgb(hex);

		if (!rgb) {
			return null;
		}

		const r = rgb.r / 255;
		const g = rgb.g / 255;
		const b = rgb.b / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);

		let h = 0;
		let s = 0;

		const l = (max + min) / 2;

		if (max !== min) {

			const delta = max - min;

			s = l > 0.5
				? delta / (2 - max - min)
				: delta / (max + min);

			switch (max) {

				case r:
					h =
						(g - b) / delta +
						(g < b ? 6 : 0);
					break;

				case g:
					h =
						(b - r) / delta +
						2;
					break;

				case b:
					h =
						(r - g) / delta +
						4;
					break;
			}

			h /= 6;
		}

		return {
			h: h * 360,
			s: s * 100,
			l: l * 100
		};
	}

	private hslToHex(
		h: number,
		s: number,
		l: number
	): string {

		s /= 100;
		l /= 100;

		const hue = h / 360;

		if (s === 0) {

			const value = Math.round(
				l * 255
			);

			return this.rgbToHex(
				value,
				value,
				value
			);
		}

		const q =
			l < 0.5
				? l * (1 + s)
				: l + s - l * s;

		const p = 2 * l - q;

		const r = this.hueToRgb(
			p,
			q,
			hue + 1 / 3
		);

		const g = this.hueToRgb(
			p,
			q,
			hue
		);

		const b = this.hueToRgb(
			p,
			q,
			hue - 1 / 3
		);

		return this.rgbToHex(
			r * 255,
			g * 255,
			b * 255
		);
	}

	private hueToRgb(
		p: number,
		q: number,
		t: number
	): number {

		if (t < 0) {
			t += 1;
		}

		if (t > 1) {
			t -= 1;
		}

		if (t < 1 / 6) {
			return p +
				(q - p) *
				6 *
				t;
		}

		if (t < 1 / 2) {
			return q;
		}

		if (t < 2 / 3) {
			return p +
				(q - p) *
				(2 / 3 - t) *
				6;
		}

		return p;
	}

	// -----------------------------
	// UTILITIES
	// -----------------------------

	private alpha(
		hex: string,
		alpha: string
	): string {

		return `${hex}${alpha}`;
	}

	private getContrastColor(
		hex: string
	): string {

		const rgb = this.hexToRgb(hex);

		if (!rgb) {
			return '#FFFFFF';
		}

		const brightness =
			(
				299 * rgb.r +
				587 * rgb.g +
				114 * rgb.b
			) / 1000;

		return brightness > 150
			? '#000000'
			: '#FFFFFF';
	}

	private hexToRgb(
		hex: string
	): {
		r: number;
		g: number;
		b: number;
	} | null {

		const cleanHex =
			hex.replace('#', '');

		if (cleanHex.length !== 6) {
			return null;
		}

		const value =
			parseInt(cleanHex, 16);

		if (Number.isNaN(value)) {
			return null;
		}

		return {
			r: (value >> 16) & 255,
			g: (value >> 8) & 255,
			b: value & 255
		};
	}

	private rgbToHex(
		r: number,
		g: number,
		b: number
	): string {

		return '#' +
			[
				r,
				g,
				b
			]
				.map(value =>
					Math.round(value)
						.toString(16)
						.padStart(2, '0')
				)
				.join('');
	}
}