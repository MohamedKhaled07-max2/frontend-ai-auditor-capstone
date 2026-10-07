import { google } from "@ai-sdk/google";

/**
 * Central AI configuration for the application.
 *
 * The model, system prompt, and generation settings live here so they can
 * be changed without modifying individual API routes.
 */

// Fast, low-latency model used for streamed responses.
export const AI_MODEL = google("gemini-3.5-flash-lite");

// Base instructions for the AI assistant.
export const SYSTEM_PROMPT =
  "You are a helpful AI assistant. Give clear, concise, and useful answers.";

// Shared generation settings.
export const AI_GENERATION_CONFIG = {
  maxOutputTokens: 1024,
  maxRetries: 1,
  temperature: 0.2,

  providerOptions: {
    google: {
      thinkingConfig: {
        thinkingLevel: "minimal" as const,
        includeThoughts: false,
      },
    },
  },
};