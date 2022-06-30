import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, parseYaml } from 'obsidian';
import * as ShowdownObsidian from './showdown-obsidian';
import { Converter } from 'showdown';
import { extractYaml } from 'obsidian-parse';
import { create, update } from 'confluence-api';
import 'open';

interface ConfluencePluginSettings {
	confluenceUrl: string;
	confluenceToken: string;
}

const DEFAULT_SETTINGS: ConfluencePluginSettings = {
	confluenceUrl: '',
	confluenceToken: ''
}

const getConfluencePageId = (text: string): string | undefined => {
	const yamlObj = parseYaml(extractYaml(text));
	return yamlObj['confluence']['pageId'];
}

const getConfluenceDataVersion = (text: string): number | undefined => {
	const yamlObj = parseYaml(extractYaml(text));
	return parseInt(yamlObj['confluence']['dataVersion']);
}

const getConfluenceSpaceKey = (text: string): string | undefined => {
	const yamlObj = parseYaml(extractYaml(text));
	return yamlObj['confluence']['spaceKey'];
}


export default class ConfluencePlugin extends Plugin {
	settings: ConfluencePluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'confluence-open-page',
			name: 'Open in confluence',
			editorCallback(editor, view) {
				const confluenceUrl = getConfluencePageId(view.data);
				// TODO switch to _links/webui
				open(confluenceUrl);
			},
		})


		this.addCommand({
			id: 'confluence-publish-command',
			name: 'Publish to confluence',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const confluencePageId = getConfluencePageId(view.data);
				const confluenceSpaceKey = getConfluenceSpaceKey(view.data);
				if (typeof confluencePageId === 'undefined' && typeof confluenceSpaceKey === 'undefined') {
					new SampleModal(this.app).open();
				}

				const confluenceDataVersion = getConfluenceDataVersion(view.data) || 1;

				const converter = new Converter({tables: true, noHeaderId: true});
				converter.addExtension(ShowdownObsidian.obsidian);
				const html = converter.makeHtml(view.data);

				const title = view.file.basename;

				console.log(`title: ${title}`);
				console.log(`html: ${html}`);
				try {
					if (confluencePageId) {
						const resp = await update({
							title: title,
							host: this.settings.confluenceUrl,
							pageId: confluencePageId,
							text: html,
							token: this.settings.confluenceToken,
							version: confluenceDataVersion
						});
						console.log(resp);
						// TODO update version in yaml
						new Notice(`Page Published to Confluence: ${resp}`, 10000);
					} else {
						const resp = await create({
							title: title,
							host: this.settings.confluenceUrl,
							spaceKey: confluenceSpaceKey,
							text: html,
							token: this.settings.confluenceToken
						});
						console.log(resp);
						// TODO write pageId and version to yaml
						new Notice(`Page Published to Confluence: ${resp}`, 10000);
					}
				} catch (error) {
					console.error(error);
					new Notice(`Error updating confluence: ${error}`, 10000);
				}
			}
		});

		this.addSettingTab(new ConfluenceSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
			.setName('Confluence URL')
			.setDesc('url')
			.addText(text => text
				.setPlaceholder('https://somehost')
				.setValue(this.plugin.settings.confluenceUrl)
				.onChange(async (value) => {
					this.plugin.settings.confluenceUrl = value;
					await this.plugin.saveSettings();
				}));

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
