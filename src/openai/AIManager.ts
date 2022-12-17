import { Configuration, OpenAIApi } from "openai";
import { CompleteOpenAI, CompleteOpenAIConfig } from "./CompleteAI";
import { EditorOpenAI, EditorOpenAIConfig } from "./EditAI";

export interface AIManagerSettings {
  apiKey: string;
  completion: CompleteOpenAIConfig;
  editor: EditorOpenAIConfig;
}

export class AIManager {
  #client: OpenAIApi;

  editor: EditorOpenAI;

  writer: CompleteOpenAI;

  #settings: AIManagerSettings;

  setSettings(value: Partial<AIManagerSettings> = {}) {
    this.#settings = { ...this.#settings, ...value }
    if ('apiKey' in value) {
      this.#client = new OpenAIApi(new Configuration({
        apiKey: this.#settings.apiKey
      }));
    }
  }

  reload() {
    this.#client = new OpenAIApi(new Configuration({
      apiKey: this.#settings.apiKey
    }));
  }

  constructor(settings: AIManagerSettings) {
    this.#settings = settings;
    this.#client = new OpenAIApi(new Configuration({
      apiKey: this.#settings.apiKey
    }));

    this.editor = new EditorOpenAI("fix spelling:", this.#client, this.#settings.editor);
    this.writer = new CompleteOpenAI(this.#client, this.#settings.completion);
  }
}