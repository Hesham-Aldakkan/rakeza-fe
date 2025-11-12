'use client';

import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DAILY_DATA = [
  { date: '2024-01-01', requests: 100, tokens: 5000, cost: 25 },
  { date: '2024-01-02', requests: 120, tokens: 6000, cost: 30 },
  { date: '2024-01-03', requests: 110, tokens: 5500, cost: 27 },
  { date: '2024-01-04', requests: 150, tokens: 7500, cost: 37 },
  { date: '2024-01-05', requests: 140, tokens: 7000, cost: 35 },
];

const MODEL_DATA = [
  { name: 'GPT-4', value: 4000 },
  { name: 'Claude 3', value: 3000 },
  { name: 'Gemini', value: 2000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function UsagePage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('usage.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('landing.features.streaming.desc')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            label: t('usage.totalRequests'),
            value: '1,230',
            change: '+12%',
          },
          {
            label: t('usage.totalTokens'),
            value: '38,500',
            change: '+8%',
          },
          {
            label: t('usage.totalCost'),
            value: '$154.00',
            change: '+15%',
          },
          {
            label: t('usage.period'),
            value: 'Jan 1-5',
            change: '2024',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-slate-800"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Line Chart - Requests Over Time */}
        <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
          <h3 className="text-lg font-semibold mb-4">{t('usage.byDay')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={DAILY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#3b82f6" />
              <Line type="monotone" dataKey="tokens" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - By Model */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-800">
          <h3 className="text-lg font-semibold mb-4">{t('usage.byModel')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={MODEL_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {MODEL_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          {t('usage.export')} CSV
        </button>
      </div>
    </div>
  );
}
