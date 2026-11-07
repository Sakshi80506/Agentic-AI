/**
 * Mastra Agent Tool Definitions (Stage 4)
 * Zod schemas and execution logic for calendar and meeting tools.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: unknown;
}

