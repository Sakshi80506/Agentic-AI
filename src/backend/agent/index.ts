/**
 * Mastra Agent Orchestration Module (Stage 3)
 * Manages Google Gemini agent definition, system prompts, and tool loops.
 */

export interface AgentConfig {
  model: string;
  temperature: number;
}

