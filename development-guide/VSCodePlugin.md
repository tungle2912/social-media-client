## Recommend plugins

`JavaScript and TypeScript Nightly`

- Id: ms-vscode.vscode-typescript-next
- Description: Enables typescript@next to power VS Code's built-in JavaScript and TypeScript support
- Version: 5.5.20240325
- Publisher: Microsoft
- VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next

`file-icons`

- Id: file-icons.file-icons
- Description: File-specific icons in VSCode for improved visual grepping.
- Version: 1.1.0
- Publisher: file-icons
- VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=file-icons.file-icons

`ESLint`

- Id: dbaeumer.vscode-eslint
- Description: Integrates ESLint JavaScript into VS Code.
- Version: 2.4.4
- Publisher: Microsoft
- VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

`EditorConfig for VS Code`

- Id: EditorConfig.EditorConfig
- Description: EditorConfig Support for Visual Studio Code
- Version: 0.16.4
- Publisher: EditorConfig
- VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig

`colorize`

- Id: kamikillerto.vscode-colorize
- Description: A vscode extension to help visualize css colors in files.
- Version: 0.11.1
- Publisher: kamikillerto
- VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize

## User settings

Auto fix all ESLint errors on Save
In VS Code, press Command + Shift + P, enter ">Open User Settings (JSON)". Add these lines at the end.

```bash
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript"],
}
```
