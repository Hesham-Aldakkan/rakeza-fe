'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Call API to login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-slate-800">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t('auth.login')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('auth.noAccount')} <Link href="/auth/signup" className="text-blue-600 hover:underline">{t('auth.signup')}</Link>
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">{t('auth.email')}</label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 dark:border-gray-700 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
            placeholder="you@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-semibold mb-2">{t('auth.password')}</label>
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <input
            {...register('password')}
            type="password"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 dark:border-gray-700 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('common.loading') : t('auth.login')}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 dark:bg-slate-800 dark:text-gray-400">Or</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700"
      >
        Sign in with Google
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.noAccount')} <Link href="/auth/signup" className="text-blue-600 hover:underline">{t('auth.signup')}</Link>
      </p>
    </div>
  );
}
