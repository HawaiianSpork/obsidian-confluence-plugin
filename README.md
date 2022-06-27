# Obsidian Confluence Plugin

This is a s plugin for Obsidian (https://obsidian.md) that sends notes to Confluence.


## Install

- Check out this code
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run build` to compile your plugin.
- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`


## API Documentation

See https://github.com/obsidianmd/obsidian-api
