'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Send, Square, Trash2, Download } from 'lucide-react';
import { useStreamingChat } from '@/hooks/useStreamingChat';

export default function ChatPage() {
  const t = useTranslations();
  const { messages, isStreaming, error, sendMessage, cancelStream, clearMessages } =
    useStreamingChat();

  const [inputValue, setInputValue] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4']);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [chatId] = useState('chat_1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || selectedModels.length === 0 || isStreaming) return;

    await sendMessage(chatId, inputValue.trim(), selectedModels, {
      temperature,
      maxTokens,
    });

    setInputValue('');
  };

  const handleExport = (format: 'markdown' | 'json') => {
    let content = '';

    if (format === 'markdown') {
      content = messages
        .map((m) => {
          const role = m.role === 'user' ? '**You:**' : '**Assistant:**';
          return `${role}\n${m.content}\n`;
        })
        .join('\n---\n\n');
    } else {
      content = JSON.stringify(messages, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat.${format === 'markdown' ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-screen flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">{t('nav.chat')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('landing.features.streaming.desc')}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Chat list sidebar - left */}
        <div className="col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-slate-800 flex flex-col">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mb-4">
            {t('chat.newChat')}
          </button>
          <div className="flex-1 overflow-y-auto space-y-2">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 cursor-pointer">
              <p className="font-semibold text-sm">{t('chat.history')}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Current Session</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="w-full mt-4 px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-sm"
            >
              {t('common.delete')}
            </button>
          )}
        </div>

        {/* Chat conversation area - middle and right */}
        <div className="col-span-3 flex gap-4">
          <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <p className="text-2xl font-semibold">{t('chat.noChats')}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Select a model and start typing to begin
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        {message.tokens && (
                          <p className="text-xs mt-1 opacity-70">
                            Tokens: {message.tokens.input} in, {message.tokens.output} out
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 dark:bg-slate-700 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex justify-start">
                      <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg p-3 max-w-xs">
                        <p className="text-sm font-semibold">{t('common.error')}</p>
                        <p className="text-xs">{error.message}</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Export buttons */}
            {messages.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2">
                <button
                  onClick={() => handleExport('markdown')}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Download className="w-4 h-4" />
                  {t('chat.exportMarkdown')}
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <Download className="w-4 h-4" />
                  {t('chat.exportJSON')}
                </button>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('chat.typeMessage')}
                  disabled={isStreaming}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                />
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={cancelStream}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    {t('chat.cancel')}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || selectedModels.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {t('chat.send')}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Models/Options panel - right */}
          <div className="w-64 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-slate-800 flex flex-col">
            <h3 className="font-semibold mb-4">{t('chat.selectModels')}</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {['gpt-4', 'claude-3', 'gemini'].map((model) => (
                <label key={model} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModels([...selectedModels, model]);
                      } else {
                        setSelectedModels(selectedModels.filter((m) => m !== model));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">{model.replace('-', ' ')}</span>
                </label>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold">{t('chat.temperature')}</label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">{t('chat.maxTokens')}</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
