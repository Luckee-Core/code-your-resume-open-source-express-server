import Anthropic from '@anthropic-ai/sdk';
import { getModelConfig } from '../../services/ai/model-config';

export type AICallResult = {
  responseText: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  modelUsed: string;
};

/**
 * Call Anthropic with the model config for the given message type.
 *
 * @param anthropic - Anthropic client
 * @param messageType - Key in model-config (e.g. `user_background_studio`)
 * @param systemPrompt - System prompt string
 * @param userMessage - User message payload string
 */
export const callAI = async (
  anthropic: Anthropic,
  messageType: string,
  systemPrompt: string,
  userMessage: string,
): Promise<AICallResult> => {
  const modelConfig = getModelConfig(messageType);

  console.log(`🤖 callAI: ${modelConfig.model} (type: ${messageType})`);

  const response = await anthropic.messages.create({
    model: modelConfig.model,
    max_tokens: modelConfig.maxTokens,
    temperature: modelConfig.temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log(`✅ callAI: responded (${response.usage.input_tokens + response.usage.output_tokens} tokens)`);

  return {
    responseText,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    modelUsed: modelConfig.model,
  };
};
