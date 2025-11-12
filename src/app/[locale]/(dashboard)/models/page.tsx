'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

const MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    capabilities: ['text', 'vision'],
    availability: 'available',
    description: { ar: 'نموذج متقدم جداً من OpenAI', en: 'Advanced model from OpenAI' },
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'Anthropic',
    capabilities: ['text', 'vision'],
    availability: 'available',
    description: { ar: 'نموذج متقدم من Anthropic', en: 'Advanced model from Anthropic' },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    capabilities: ['text', 'vision', 'audio'],
    availability: 'available',
    description: { ar: 'نموذج متقدم من Google', en: 'Advanced model from Google' },
  },
];

export default function ModelsPage() {
  const t = useTranslations();
  const locale = 'ar';
  const [filterProvider, setFilterProvider] = useState('all');

  const filteredModels =
    filterProvider === 'all'
      ? MODELS
      : MODELS.filter((m) => m.provider === filterProvider);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('nav.models')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('landing.topModels.subtitle')}
        </p>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="text-sm font-semibold block mb-2">
            {t('models.filterByProvider')}
          </label>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800"
          >
            <option value="all">{t('models.allModels')}</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Anthropic">Anthropic</option>
            <option value="Google">Google</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold">{model.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{model.provider}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  model.availability === 'available'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {t(`models.${model.availability}`)}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {model.description[locale as 'ar' | 'en']}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {model.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full"
                >
                  {t(`models.${cap}`)}
                </span>
              ))}
            </div>

            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              {t('common.learnMore')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
