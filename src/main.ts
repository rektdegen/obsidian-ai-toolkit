import {
  App,
  Editor,
  MarkdownView,
  Plugin,
  PluginManifest,
} from 'obsidian';
import { ContextMenu } from './menus';
import { AIManager, AIManagerSettings } from './openai/AIManager';
import { AISettingsTab } from './settings';
import { registerIcons } from './icons';

const DEFAULT_SETTINGS: AIPluginSettings = {
  openai: {
    apiKey: '',
    completion: {
      model: 'text-babbage-001',
      maxTokens: 256,
      results: 1,
      temperature: 0.49,
      stopAt: "paragraph"
    },
    editor: {
      model: 'text-davinci-edit-001',
      results: 1,
      temperature: 0.1,
    },
  },
};

export interface AIPluginSettings {
  openai: AIManagerSettings;
}

export default class AIPlugin extends Plugin {
  settings: AIPluginSettings = DEFAULT_SETTINGS;

  ai: AIManager | null = null;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  completeMenuItem = new ContextMenu(
    'complete',
    'openai',
    async (_evt, editor, view) => {
      const input = editor.getSelection();
      const [output] = (await this.ai?.writer.complete(input)) ?? [''];
      editor.replaceRange(output, editor.getCursor());
    }
  );

  rewriteMenuItem = new ContextMenu(
    'rewrite',
    'openai',
    async (_evt, editor, view) => {
      const input = editor.getSelection();
      const [output] = (await this.ai?.editor.edit(input)) ?? [''];
      editor.replaceRange(output, editor.getCursor());
    }
  );

  async onload() {
    await this.loadSettings();
    this.ai = new AIManager(this.settings.openai);
    registerIcons()

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: 'sample-editor-command',
      name: 'Sample editor command',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());
        editor.replaceSelection('Sample Editor Command');
      },
    });

    this.registerEvent(this.completeMenuItem.register(this.app.workspace));
    this.registerEvent(this.rewriteMenuItem.register(this.app.workspace));

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new AISettingsTab(this.app, this));

    this.addCommand({
      id: 'openai-complete',
      name: 'Generate completion',
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        const input = editor.somethingSelected() ? editor.getSelection() : editor.getValue();
        if (input === '') return;
        const [output] = (await this.ai?.writer.complete(input)) ?? [''];
        if (output === '') return;
        editor.replaceRange(output, editor.getCursor());
      }
    });
  }

  onunload() { }

  async loadSettings() {
    this.settings = Object.assign({}, this.settings, await this.loadData());
  }

  async saveSettings() {
    this.ai?.setSettings(this.settings.openai);
    await this.saveData(this.settings);
  }
}
