'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Call API to create account
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-slate-800">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t('auth.signupSuccess')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your email to verify your account.
          </p>
        </div>
        <Link
          href="/ar"
          className="block w-full rounded-lg bg-blue-600 py-2 text-center font-semibold text-white hover:bg-blue-700"
        >
          {t('common.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-slate-800">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t('auth.signup')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('auth.noAccount')} <Link href="/auth/login" className="text-blue-600 hover:underline">{t('auth.login')}</Link>
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
          <label className="block text-sm font-semibold mb-2">{t('auth.password')}</label>
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

        <div>
          <label className="block text-sm font-semibold mb-2">{t('auth.passwordConfirm')}</label>
          <input
            {...register('passwordConfirm')}
            type="password"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 dark:border-gray-700 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('common.loading') : t('auth.signup')}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.haveAccount')} <Link href="/auth/login" className="text-blue-600 hover:underline">{t('auth.login')}</Link>
      </p>
    </div>
  );
}
