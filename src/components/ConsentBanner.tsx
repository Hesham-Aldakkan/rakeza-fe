'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAnalytics } from '@/lib/analytics';
import { useTranslations } from 'next-intl';

export function ConsentBanner() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has already given consent
    const stored = localStorage.getItem('analytics-consent');
    if (stored === null) {
      // No stored consent, show banner
      setIsVisible(true);
    }
  }, []);

  if (!mounted || !isVisible) return null;

  const handleAccept = () => {
    getAnalytics().grantConsent();
    setIsVisible(false);
  };

  const handleReject = () => {
    getAnalytics().revokeConsent();
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Privacy & Analytics</h3>
            <p className="text-sm text-gray-300">
              We use analytics to understand how you use our site and improve your experience.
              No personal data is collected without your consent.
              {' '}
              <a
                href="/privacy"
                className="text-blue-400 hover:underline"
              >
                Learn more
              </a>
              .
            </p>
          </div>

          <button
            onClick={handleReject}
            className="flex-shrink-0 p-2 hover:bg-slate-800 rounded transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm transition"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-slate-800 font-semibold text-sm transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
