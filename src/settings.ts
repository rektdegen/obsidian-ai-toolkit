import { App, PluginSettingTab, Setting } from "obsidian";
import AIPlugin from "./main";

export class AISettingsTab extends PluginSettingTab {
  plugin: AIPlugin;

  constructor(app: App, plugin: AIPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'AI Toolkit Settings' });

    const openaiSection = containerEl.createEl("section");
    openaiSection.createEl("h2", { text: "Open AI" });

    new Setting(openaiSection)
      .setName('API KEY')
      .setDesc('Your Open AI API key. Keep this key private!')
      .setClass('openai-api-key-input')
      .addText(text => text
        .setPlaceholder('xx-xxxxxxxxx')
        .setValue(this.plugin.settings.openai.apiKey)
        .onChange(async (value) => {
          if (!this.plugin.ai) return;
          this.plugin.settings.openai.apiKey = value;
          await this.plugin.saveSettings();
          // this.plugin.ai.reload();
        }));

    const openaiCompletionSection = openaiSection.createEl("section");
    openaiCompletionSection.createEl("h3", { text: "Text completion & generation" });

    new Setting(openaiCompletionSection)
      .setName('Model')
      .setDesc('The GPT-3 model to use for text completion.')
      .addDropdown((dd) => {
        dd.addOptions({
          'text-davinci-003': 'davinci',
          'text-babbage-001': 'babbage',
          'text-curie-001': 'curie',
          'text-ada-001': 'ada',
        })
          .setValue(this.plugin.settings.openai.completion.model)
          .onChange(async (value) => {
            if (!this.plugin.ai) return;
            this.plugin.settings.openai.completion.model = value;
            await this.plugin.saveSettings();
            this.display();
          })
      })
    new Setting(openaiCompletionSection)
      .setName('Stop indicator')
      .setDesc('Force the AI to limit it\'s responses to a single sentence or paragraph instead of only using the token limit.')
      .addDropdown((dd) => {
        dd.addOptions({
          'sentence': 'sentence',
          'paragraph': 'paragraph',
          'limit': 'token limit',
        })
          .setValue('limit')
          .onChange(async (value) => {
            if (!this.plugin.ai) return;
            this.plugin.settings.openai.completion.stopAt = value as "sentence" | "paragraph" | "limit" | null;
            await this.plugin.saveSettings();
          })
      })
    new Setting(openaiCompletionSection)
      .setName('Temperature')
      .setDesc('What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.')
      .addSlider((slider) => {
        slider
          .setLimits(0, 1, 0.01)
          .setDynamicTooltip()
          .setValue(0.4)
          .onChange(async (value) => {
            if (!this.plugin.ai) return;
            this.plugin.settings.openai.completion.temperature = value;
            await this.plugin.saveSettings();
          })
      })
    new Setting(openaiCompletionSection)
      .setName('Max Tokens')
      .setDesc('The maximum amount of tokens to spent on a single request.')
      .addSlider((slider) => {
        const { model } = this.plugin.settings.openai.completion;
        slider
          .setLimits(1, model === 'text-davinci-003' ? 4096 : 2048, 1)
          .setDynamicTooltip()
          .setValue(this.plugin.settings.openai.completion.maxTokens)
          .onChange(async (value) => {
            if (!this.plugin.ai) return;
            this.plugin.settings.openai.completion.maxTokens = value;
            await this.plugin.saveSettings();
          })
      })
  }
}