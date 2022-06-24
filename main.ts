import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Converter } from 'showdown';

interface ConfluencePluginSettings {
	confluenceToken: string;
}

export default class ConfluencePlugin extends Plugin {
	settings: ConfluencePluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addCommand({
			id: 'confluence-publish-command',
			name: 'Publish to confluence',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const converter = new Converter();
				const html = converter.makeHtml(view.data);

				console.log(`htmll: ${html}`);
			}
		});

		this.addSettingTab(new ConfluenceSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = await this.loadData();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class ConfluenceSettingTab extends PluginSettingTab {
	plugin: ConfluencePlugin;

	constructor(app: App, plugin: ConfluencePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Confluence Plugin.'});

		new Setting(containerEl)
			.setName('Confluence Private Token')
			.setDesc('secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.confluenceToken)
				.onChange(async (value) => {
					this.plugin.settings.confluenceToken = value;
					await this.plugin.saveSettings();
				}));
	}
}
