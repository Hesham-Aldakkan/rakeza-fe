# Rakeza Frontend

A production-grade, Arabic-first frontend for Rakeza - unified access to the world's most powerful AI models.

## 🌍 Arabic-First Design

This application is built with Arabic-first localization (RTL) using **next-intl**, with English as a secondary language. All routes are localized (`/ar/*` and `/en/*`).

**Current Language**: Arabic (RTL, default)
**Secondary Language**: English (LTR)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd rakeza-fe

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000` and will automatically redirect to the Arabic version (`/ar`).

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── [locale]/          # Localized routes
│   │   ├── (public)/      # Public pages (landing)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx   # Landing page
│   │   ├── (auth)/        # Auth pages
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── (dashboard)/   # Dashboard (authenticated)
│   │       ├── layout.tsx
│   │       ├── chat/
│   │       ├── models/
│   │       ├── usage/
│   │       └── settings/
│   ├── api/               # API routes (thin layer if needed)
│   └── middleware.ts      # next-intl middleware
│
├── components/            # UI components
├── modules/              # Feature modules
├── lib/                  # Core utilities
│   ├── api-client.ts     # Fetch wrapper with retry/timeout/SSE
│   ├── config.ts         # Typed config from environment
│   └── utils.ts          # Helper functions
│
├── hooks/                # Custom React hooks
│   └── useApi.ts         # API data fetching hooks
│
├── types/                # TypeScript types
│   └── index.ts          # All shared types
│
├── messages/             # i18n translations
│   ├── ar.json          # Arabic translations
│   └── en.json          # English translations
│
├── test/                 # Testing
│   ├── setup.ts         # Vitest setup
│   ├── utils.tsx        # Test utilities
│   ├── mocks/           # MSW mocks
│   │   ├── handlers.ts
│   │   └── server.ts
│   └── e2e/             # Playwright tests
│
├── styles/               # Tailwind & theme config
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vitest.config.ts      # Vitest configuration
```

## 🔧 Configuration

All configuration is environment-driven via `.env.local`. No hardcoded values.

### Environment Variables

**Public (exposed to browser):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_DEFAULT_LOCALE=ar
NEXT_PUBLIC_SUPPORTED_LOCALES=ar,en
NEXT_PUBLIC_SITE_NAME=Rakeza
NEXT_PUBLIC_SITE_DESCRIPTION=Unified access to the world's most powerful AI models
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Features
NEXT_PUBLIC_FEATURE_CHAT=true
NEXT_PUBLIC_FEATURE_PARALLEL=true
NEXT_PUBLIC_FEATURE_MEDIATOR=true
NEXT_PUBLIC_FEATURE_MODELS=true
NEXT_PUBLIC_FEATURE_USAGE=true
NEXT_PUBLIC_FEATURE_BILLING=true

# Streaming
NEXT_PUBLIC_STREAM_HEARTBEAT_MS=30000
NEXT_PUBLIC_MAX_MODELS_PER_REQUEST=5

# Analytics & Security
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_ANALYTICS_KEY=
NEXT_PUBLIC_CSP_NONCE_HEADER=x-nonce
```

**Private (server-only):**
```env
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

## 🎨 Design & Styling

- **Framework**: Tailwind CSS with RTL support (`tailwindcss-rtl`)
- **Components**: shadcn/ui patterns (no direct dependency, custom components)
- **Theme**: Light/Dark mode support with `next-themes`
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG 2.1 AA compliant

## 🌐 Localization

Using **next-intl** for Arabic-first localization:

```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  return <h1>{t('common.appName')}</h1>; // "ركيزة"
}
```

### Locale Structure

- **Default**: Arabic (`ar`) - RTL
- **Secondary**: English (`en`) - LTR
- **Routes**: `/ar/*` and `/en/*`
- **Middleware**: Automatic locale detection and redirection

## 🔌 API Integration

### Fetch Wrapper with Retry, Timeout & Backoff

```typescript
import { fetchWithRetry, fetchSSE, postJson } from '@/lib/api-client';

// Simple fetch with automatic retries
const data = await fetchWithRetry('/users');

// POST with custom timeout
const result = await postJson('/chats', { title: 'New Chat' }, { timeout: 5000 });

// SSE Streaming
await fetchSSE('/chat/stream', (message) => {
  console.log(message);
});
```

### Using Hooks

```typescript
import { useApi, useMutation } from '@/hooks/useApi';

function MyComponent() {
  const { data, isLoading, error, fetch } = useApi('/models');
  const { mutate } = useMutation('/chats', 'POST');

  // ...
}
```

## 📊 Key Features

### 1. **Landing Page** (`/ar`, `/en`)
   - Hero section with CTAs
   - Why Rakeza section
   - Top models showcase
   - Pricing overview
   - How it works (4-step process)
   - Features highlight
   - Trust/testimonials
   - FAQ (6-8 items)
   - Contact form
   - Footer with links

### 2. **Chat System**
   - Single & multi-model chat
   - Real-time streaming (SSE)
   - Rich message composer
   - Temperature & token controls
   - Chat history with search
   - Export (Markdown, JSON)
   - Pin/favorite chats

### 3. **Models Catalog**
   - Model listing with filters
   - Provider filtering
   - Capability badges
   - Availability status
   - Description (Arabic/English)
   - Pricing hints

### 4. **Usage Analytics**
   - Daily request charts
   - Token usage tracking
   - Cost breakdown by model
   - CSV export
   - Time-range filtering

### 5. **Settings**
   - Profile management
   - API key management (show/hide, rotate, revoke)
   - Theme toggle (light/dark/system)
   - Locale selection
   - Notification preferences

### 6. **Authentication**
   - Sign up with validation
   - Sign in with email/password
   - Protected routes

## 🧪 Testing

### Unit & Component Tests (Vitest)

```bash
npm run test              # Run tests
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate coverage
```

Tests use **React Testing Library** and **MSW** (Mock Service Worker) for API mocking.

**Test files**: `src/**/*.test.ts(x)`

### E2E Tests (Playwright)

```bash
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Open Playwright UI
```

Tests check:
- Landing page rendering (AR/EN)
- Navigation flows
- Form submissions
- Accessibility (keyboard nav)
- Responsive design

**Test files**: `src/test/e2e/**/*.spec.ts`

### Linting & Formatting

```bash
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run typecheck        # TypeScript check
```

## 🔒 Security

### Built-in Security

- **X-Frame-Options**: `DENY` (prevent clickjacking)
- **X-Content-Type-Options**: `nosniff` (prevent MIME sniffing)
- **Referrer-Policy**: `no-referrer`
- **Permissions-Policy**: Restrict camera, microphone, geolocation

### Practices

- ✅ No hardcoded secrets (all via environment variables)
- ✅ Strict TypeScript (`noImplicitAny`, `strictNullChecks`)
- ✅ Input validation with Zod
- ✅ Request timeouts and abort signals
- ✅ No `eval()` or dynamic script injection
- ✅ Sanitize user content before rendering

### To Add

- [ ] CSP headers (nonce-based for inline styles)
- [ ] CORS policy validation
- [ ] Rate limiting
- [ ] CSRF protection

## 📈 Performance

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Image Optimization**: Next.js image component with AVIF/WebP formats
- **Code Splitting**: Route-based code splitting (App Router)
- **Font Optimization**: `next/font` with preload
- **Tree Shaking**: Unused code elimination via Tailwind & bundler

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Link to Vercel project
vercel link

# Set environment variables in Vercel dashboard
# Deploy
vercel deploy
```

Environment variables are automatically picked up from `.env.local` or Vercel's environment configuration.

### Self-Hosted

```bash
npm run build
npm run start
```

Ensure all `NEXT_PUBLIC_*` variables are set in deployment environment.

## 📋 Environment Setup Checklist

- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to your backend
- [ ] Set `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_BASE_URL`
- [ ] Configure analytics key if using (PostHog, Plausible, etc.)
- [ ] Add Sentry DSN for error tracking
- [ ] Set Stripe publishable key if using
- [ ] Configure SMTP for contact form emails

## 🛠️ Development Workflow

### Adding a New Feature

1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Create types**: `src/types/index.ts`
3. **Create API client**: `src/lib/api-*.ts`
4. **Create hook**: `src/hooks/use*.ts`
5. **Create components**: `src/components/**/*.tsx`
6. **Create page**: `src/app/[locale]/...`
7. **Add tests**: `src/test/**/*.spec.ts(x)`
8. **Add translations**: `src/messages/ar.json` & `en.json`
9. **Commit with clear message**

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(chat): add streaming support`
- `fix(auth): handle token refresh`
- `docs(readme): update setup instructions`

## 📚 Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + tailwindcss-rtl
- **UI Components**: shadcn/ui patterns + Radix UI
- **Data Fetching**: TanStack Query (optional)
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand (optional)
- **Localization**: next-intl
- **Theme**: next-themes
- **Charts**: Recharts
- **Icons**: lucide-react
- **Testing**: Vitest + React Testing Library + MSW + Playwright
- **Linting**: ESLint + Prettier

## 📖 Documentation

- **API Docs**: [Backend API documentation](https://docs.rakeza.io/api)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

## 📞 Support

For issues, feature requests, or questions:
- GitHub Issues: [Link to issues]
- Email: support@rakeza.io

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Arabic-speaking users worldwide**
