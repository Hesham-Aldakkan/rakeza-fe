'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/auth/signup"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('landing.hero.cta')}
              </Link>
              <Link
                href="#pricing"
                className="inline-block px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('landing.hero.secondary')}
              </Link>
            </div>
          </div>
          <div className="mt-20 flex justify-center">
            <ChevronDown className="w-8 h-8 animate-bounce text-gray-400" />
          </div>
        </div>
      </section>

      {/* Why Rakeza */}
      <section id="why-rakeza" className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('landing.whyRakeza.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.raw('landing.whyRakeza.items').map((item: any, idx: number) => (
              <div key={idx} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Models */}
      <section id="models" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            {t('landing.topModels.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            {t('landing.topModels.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'GPT-4', provider: 'OpenAI', capabilities: ['Text', 'Vision'] },
              { name: 'Claude 3', provider: 'Anthropic', capabilities: ['Text', 'Vision'] },
              { name: 'Gemini', provider: 'Google', capabilities: ['Text', 'Vision', 'Audio'] },
              { name: 'Llama 2', provider: 'Meta', capabilities: ['Text'] },
              { name: 'Mistral', provider: 'Mistral AI', capabilities: ['Text', 'Vision'] },
              { name: 'PaLM', provider: 'Google', capabilities: ['Text'] },
            ].map((model) => (
              <div
                key={model.name}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{model.provider}</p>
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            {t('landing.pricing.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            {t('landing.pricing.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tier: 'Starter', price: '$10', features: ['Up to 1M tokens/month', '3 models', 'Email support'] },
              { tier: 'Pro', price: '$50', features: ['Up to 10M tokens/month', 'All models', 'Priority support'] },
              { tier: 'Enterprise', price: 'Custom', features: ['Unlimited tokens', 'All models', 'Dedicated support'] },
            ].map((plan) => (
              <div
                key={plan.tier}
                className="p-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-semibold mb-2">{plan.tier}</h3>
                <p className="text-3xl font-bold mb-4">
                  {plan.price} <span className="text-sm text-gray-500 dark:text-gray-400">/mo</span>
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="mr-3 text-blue-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="block w-full text-center px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t('common.startNow')}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-12">
            {t('landing.pricing.customBundles')}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('landing.howItWorks.title')}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {t.raw('landing.howItWorks.steps').map((step: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('landing.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { key: 'streaming', icon: '🚀' },
              { key: 'parallel', icon: '⚡' },
              { key: 'mediator', icon: '🧠' },
              { key: 'history', icon: '💾' },
              { key: 'arabic', icon: '🌐' },
            ].map(({ key, icon }) => (
              <div key={key} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {t(`landing.features.${key}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(`landing.features.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('landing.faq.title')}
          </h2>
          <div className="space-y-4">
            {t.raw('landing.faq.items').map((item: any, idx: number) => (
              <details key={idx} className="group border border-gray-200 dark:border-gray-700 rounded-lg">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800">
                  <span>{item.q}</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-gray-600 dark:text-gray-400">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('landing.cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">{t('common.appName')}</h3>
              <p className="text-gray-400">{t('common.appDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">{t('nav.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition">{t('nav.pricing')}</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('nav.docs')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/docs" className="hover:text-white transition">API Docs</a></li>
                <li><a href="/docs/guides" className="hover:text-white transition">Guides</a></li>
                <li><a href="/docs/examples" className="hover:text-white transition">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition">{t('footer.privacy')}</a></li>
                <li><a href="/terms" className="hover:text-white transition">{t('footer.terms')}</a></li>
                <li><a href="/contact" className="hover:text-white transition">{t('footer.contact')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400">{t('footer.copyright')} © 2024</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
