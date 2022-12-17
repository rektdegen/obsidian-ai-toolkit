import { OpenAIApi } from "openai";
import { OpenAI, OpenAIConfig } from "./AI";

export type CompleteAIModel = 'text-davinci-003' | 'text-babbage-001' | 'text-curie-001' | 'text-ada-001';


export interface CompleteOpenAIConfig extends OpenAIConfig {
  model: CompleteAIModel | string;
  maxTokens: number;
  stopAt: "sentence" | "paragraph" | "limit" | null;
}

export class CompleteOpenAI extends OpenAI {
  get maxTokens() {
    const max = this.model === 'text-davinci-003' ? 4096 : 2048;
    return Math.max(1, Math.min(this.#config.maxTokens, max));
  }

  get stopAt() {
    if (!this.#config.stopAt) return null;
    switch (this.#config.stopAt) {
      case "limit":
        return null;
      case "paragraph":
        return "\n"
      case "sentence":
        return "."
      default:
        return null;
    }
  }

  get config() {
    return {
      ...super.baseConfig,
      max_tokens: this.maxTokens,
      stop: this.stopAt
    }
  }

  #config: CompleteOpenAIConfig;

  constructor(client: OpenAIApi | null = null, config: CompleteOpenAIConfig) {
    super(client, config);
    this.#config = config;
  }

  async complete(prompt: string, suffix: string | null = null) {
    console.log({
      ...this.config,
      prompt,
      suffix
    })
    const response = await this.client.createCompletion({
      ...this.config,
      prompt,
      suffix
    });

    console.log(JSON.stringify(response.data, null, 2))

    return response.data.choices.map(c => c.text ?? '');
  }
}