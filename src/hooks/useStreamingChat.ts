import { useState, useCallback, useRef } from 'react';
import { fetchSSE } from '@/lib/api-client';
import type { ChatMessage, StreamingMessage } from '@/types';

interface StreamingChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: Error | null;
  isAborted: boolean;
}

export function useStreamingChat() {
  const [state, setState] = useState<StreamingChatState>({
    messages: [],
    isStreaming: false,
    error: null,
    isAborted: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageRef = useRef<string>('');

  const sendMessage = useCallback(
    async (
      chatId: string,
      content: string,
      models: string[],
      options?: {
        temperature?: number;
        maxTokens?: number;
      }
    ) => {
      try {
        setState((prev) => ({
          ...prev,
          isStreaming: true,
          error: null,
          isAborted: false,
        }));

        // Add user message
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          chatId,
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMessage],
        }));

        // Initialize abort controller for streaming
        abortControllerRef.current = new AbortController();
        streamingMessageRef.current = '';

        // Prepare streaming URL with parameters
        const params = new URLSearchParams({
          chatId,
          models: models.join(','),
          ...(options?.temperature && { temperature: String(options.temperature) }),
          ...(options?.maxTokens && { maxTokens: String(options.maxTokens) }),
        });

        const streamUrl = `/api/chat/stream?${params.toString()}`;

        // Create initial assistant message
        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          chatId,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        let totalInputTokens = 0;
        let totalOutputTokens = 0;

        // Start streaming
        await fetchSSE(
          streamUrl,
          (data) => {
            try {
              const message: StreamingMessage = JSON.parse(data);

              switch (message.type) {
                case 'content':
                  if (message.content) {
                    streamingMessageRef.current += message.content;
                    setState((prev) => ({
                      ...prev,
                      messages: prev.messages.map((m) =>
                        m.id === assistantMessage.id
                          ? { ...m, content: streamingMessageRef.current }
                          : m
                      ),
                    }));
                  }
                  break;

                case 'token_usage':
                  if (message.tokens) {
                    totalInputTokens += message.tokens.input;
                    totalOutputTokens += message.tokens.output;
                    setState((prev) => ({
                      ...prev,
                      messages: prev.messages.map((m) =>
                        m.id === assistantMessage.id
                          ? {
                              ...m,
                              tokens: {
                                input: totalInputTokens,
                                output: totalOutputTokens,
                              },
                            }
                          : m
                      ),
                    }));
                  }
                  break;

                case 'error':
                  throw new Error(message.error?.message || 'Streaming error');

                case 'done':
                  setState((prev) => ({
                    ...prev,
                    isStreaming: false,
                    messages: prev.messages.map((m) =>
                      m.id === assistantMessage.id
                        ? {
                            ...m,
                            content: streamingMessageRef.current,
                            updatedAt: new Date().toISOString(),
                          }
                        : m
                    ),
                  }));
                  break;
              }
            } catch (err) {
              console.error('Error parsing stream message:', err);
            }
          },
          abortControllerRef.current.signal,
          (error) => {
            if (abortControllerRef.current?.signal.aborted) {
              setState((prev) => ({
                ...prev,
                isStreaming: false,
                isAborted: true,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                isStreaming: false,
                error,
              }));
            }
          }
        );
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },
    []
  );

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        isAborted: true,
      }));
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      error: null,
      isAborted: false,
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    cancelStream,
    clearMessages,
  };
}
