'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Eye, EyeOff, Copy, RotateCcw, Trash2 } from 'lucide-react';

const API_KEYS = [
  {
    id: '1',
    name: 'Development Key',
    masked: 'rkz_*****...abc123',
    createdAt: '2024-01-01',
    lastUsed: '2024-01-15',
  },
  {
    id: '2',
    name: 'Production Key',
    masked: 'rkz_*****...xyz789',
    createdAt: '2024-01-05',
    lastUsed: '2024-01-14',
  },
];

export default function SettingsPage() {
  const t = useTranslations();
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [theme, setTheme] = useState('system');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('settings.profile')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">{t('auth.email')}</label>
            <input
              type="email"
              defaultValue="user@example.com"
              disabled
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            {t('settings.profile')}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('settings.preferences')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">{t('settings.theme')}</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="light">{t('settings.light')}</option>
              <option value="dark">{t('settings.dark')}</option>
              <option value="system">{t('settings.system')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">{t('settings.language')}</label>
            <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('settings.notifications')}</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">{t('settings.emailNotifications')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">{t('settings.marketingEmails')}</span>
          </label>
        </div>
      </div>

      {/* API Keys */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('settings.apiKeys')}</h2>
          <button
            onClick={() => setShowNewKeyForm(!showNewKeyForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
          >
            {t('settings.createKey')}
          </button>
        </div>

        {showNewKeyForm && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
            <input
              type="text"
              placeholder={t('settings.keyName')}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white mb-3"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm">
              {t('common.create')}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {API_KEYS.map((key) => (
            <div key={key.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{key.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{key.masked}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>{t('settings.createdAt')}: {key.createdAt}</p>
                <p>{t('settings.lastUsed')}: {key.lastUsed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
        <h2 className="text-xl font-semibold mb-4">{t('settings.security')}</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-2 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold">
            {t('auth.password')}
          </button>
          <button className="w-full px-4 py-2 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold">
            Two-Factor Authentication
          </button>
        </div>
      </div>
    </div>
  );
}
