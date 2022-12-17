import { App, Modal, Setting } from "obsidian";

export default class SetupModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void, initialValue = "") {
    super(app);
    this.onSubmit = onSubmit;
    this.result = initialValue;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Enter your OpenAI API Key" });

    new Setting(contentEl)
      .setName("API KEY")
      .addText((text) =>
        text.onChange((value) => {
          this.result = value
        }));

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}