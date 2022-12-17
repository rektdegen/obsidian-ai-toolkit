import { OpenAIApi } from "openai";
import { type } from "os";
import { OpenAI, OpenAIConfig } from "./AI";

export type EditorAIModel = "text-davinci-edit-001" | "code-davinci-edit-001";

export interface EditorOpenAIConfig extends OpenAIConfig {
    model: EditorAIModel | string;
}

export class EditorOpenAI extends OpenAI {
    #instruction: string;

    get config() {
        return {
            ...super.baseConfig,
            instruction: this.#instruction,
        }
    }

    constructor(instruction: string, client: OpenAIApi | null = null, config: EditorOpenAIConfig) {
        super(client, config);
        this.#instruction = instruction;
    }

    async edit(input: string) {
        try {
            const response = await this.client.createEdit({
                ...this.config,
                instruction: this.#instruction,
                input: input
            });

            function isText(value?: string): value is string {
                return typeof value === 'string';
            }

            return response.data.choices.filter(c => isText(c.text)).map(c => c.text!)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}