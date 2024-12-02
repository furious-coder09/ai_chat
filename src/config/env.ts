interface Config {
  geminiApiKey: string | undefined;
}

export const config: Config = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY
};