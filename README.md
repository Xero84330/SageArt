# Sage

A thoughtful, lightweight workspace personalization tool for VS Code.

Whether you prefer a calm dark blue atmosphere or an energetic deep violet, **Sage** lets you instantly swap curated environment palettes or build your own custom IDE and syntax theme with a clean visual color picker—no manual JSON editing needed.

---

## Features

### 1. Curated IDE Themes (4 Defaults + 1 Custom)
Transform your entire editor surface (editor background, sidebars, activity bar, terminal, and status bar) with balanced, distraction-free color harmonies:
* **Sapphire** (`Theme 1`): Deep ocean tones with crisp modern accents.
* **Emerald** (`Theme 2`): Calming forest and mint hues that reduce eye strain during long coding sessions.
* **Onyx** (`Theme 3`): Sleek, refined obsidian-dark minimalism.
* **Amethyst** (`Theme 4`): Creative, deep purple-infused backdrop for focused night coding.
* **Create Custom Theme**: Pick your own 5 core colors (`Editor`, `Accent`, `Secondary`, `Text`, `Surface`), and Sage’s built-in color engine will mathematically compute complementary lightness, borders, highlights, and contrast for you. Saved directly to `themes/sage-custom.json`.

### 2. Tailored Syntax Highlighting (4 Defaults + 1 Custom)
Fine-tune how your code actually reads on screen:
* **Sage**: Natural herbal green and soft blue syntax palette.
* **Forest**: Earthy greens and warm tones for rich syntax recognition.
* **Ocean**: Cool cyan, azure, and seafoam highlights.
* **Sunset**: Warm amber and coral tones that make logic and keywords pop.
* **Customize Syntax Colors**: Want specific colors for keywords, functions, types, strings, or comments? Use the interactive customizer to define your palette. Saved directly into `syntax/sage-custom-syntax.json` and applied to your editor tokens.

### 3. Integrated Activity Bar Panel
* Conveniently docked in your Activity Bar under **"Customize your office"**.
* Features subtle **(i) info buttons** on each section with clear descriptions of what each control affects so you never have to guess.

---

## How to Use

1. Click on the **Sage** icon in the VS Code Activity Bar (left sidebar).
2. Under **Select Theme**, click any palette button to switch your overall IDE theme instantly.
3. Under **Choose Syntax Style**, select your preferred code highlighting style.
4. To build your own look, click **Create Custom Theme** or **Customize Syntax Colors**, choose your colors in the dedicated panel, and hit **Apply**.

---

## Requirements

* Visual Studio Code version **1.80.0** or newer.
* No additional external tools or runtime dependencies required.

---

## Extension Settings

Sage adjusts standard VS Code appearance preferences cleanly:
* `workbench.colorTheme`: Updated when you select or generate an IDE theme.
* `editor.tokenColorCustomizations`: Updated when you activate syntax styles or save a custom syntax palette.

---

## Known Issues

* If you have existing workspace-level theme overrides defined in `.vscode/settings.json`, they may take priority over global theme selections until cleared.

---

## Release Notes

### 0.0.1
* Initial release of **Sage**.
* Added 4 curated workbench themes and an automated Custom Theme Generator.
* Added 4 distinct syntax highlighting presets and an interactive syntax customizer.
* Added dedicated sidebar Webview with responsive buttons and interactive info tooltips.
* Packaged standalone assets (`media/sage.css`, `media/sage.js`, `media/sage.svg`) optimized for production.

---

**Enjoy your new workspace!**
