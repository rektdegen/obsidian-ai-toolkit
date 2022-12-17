import { OpenAIApi } from "openai";

export interface OpenAIConfig {
    model: string;
    results: number;
    temperature: number;
}

export class OpenAI {
    #client: OpenAIApi | null;
    #config: OpenAIConfig;

    get client(): OpenAIApi {
        if (this.#client == null) {
            throw new Error('No active client')
        }
        return this.#client;
    }

    set client(value: OpenAIApi) {
        this.#client = value;
    }

    get results() {
        return this.#config.results;
    }

    set results(n: number) {
        this.#config.results = n;
    }

    get model(): string {
        return this.#config.model;
    }

    set model(value: string) {
        this.#config.model = value;
    }

    get temperature() {
        return Math.max(0, Math.min(this.#config.temperature, 1));
    }

    set temperature(value: number) {
        console.log(`temperature set to: ${value}`)
        this.#config.temperature = Math.max(0, Math.min(value, 1));
    }

    get baseConfig() {
        return {
            model: this.model,
            n: this.results,
            temperature: this.temperature,
            top_p: 1
        }
    }

    constructor(client: OpenAIApi | null = null, config: OpenAIConfig) {
        this.#client = client;
        this.#config = config;
    }
}