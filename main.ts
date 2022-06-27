import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, parseYaml } from 'obsidian';
import * as ShowdownObsidian from './showdown-obsidian';
import { Converter } from 'showdown';
import { request } from 'http';
import * as Showdown from 'showdown';
import { extractYaml } from 'obsidian-parse';

//Showdown.extension('obsidian', ShowdownObsidian.obsidian);

interface ConfluencePluginSettings {
	confluenceToken: string;
}

const getConfluencePage = (text: string): string | undefined => {
	const yamlObj = parseYaml(extractYaml(text));
	return yamlObj['confluenceUrl'];
}


export default class ConfluencePlugin extends Plugin {
	settings: ConfluencePluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'confluence-publish-command',
			name: 'Publish to confluence',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const confluenceUrl = getConfluencePage(view.data);
				console.log(confluenceUrl);
				if (typeof confluenceUrl === 'undefined') {
					new SampleModal(this.app).open();
				}

				const converter = new Converter({tables: true, noHeaderId: true});
				converter.addExtension(ShowdownObsidian.obsidian);
				const html = converter.makeHtml(view.data);

				console.log(`html: ${html}`);
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
		contentEl.setText('Confluence Url not defined.');
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
