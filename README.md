# FinTrack AI

<div align="center">

![FinTrack AI](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![FinTrack AI](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![FinTrack AI](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![FinTrack AI](https://img.shields.io/badge/OpenRouter-AI-8A2BE2)
![FinTrack AI](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)

</div>

FinTrack AI is a modern personal finance dashboard designed for the FlyRank AI Frontend Engineering Capstone. It combines a polished financial management interface with AI-generated insights to help users understand spending behavior, measure financial health, and act on actionable recommendations.

## Overview

This project delivers a responsive finance workspace that includes:

- a dashboard with key financial metrics
- transaction and spending views
- budget tracking and progress indicators
- analytics and goal-oriented summaries
- an AI insights panel powered by OpenRouter and model providers such as Gemini-class models

The application is built with Next.js App Router, React, TypeScript, and Tailwind styling, with an emphasis on strong UX, data clarity, and an AI-assisted decision support layer.

## Problem Statement

Many people struggle to maintain financial awareness because traditional banking tools are fragmented, static, and difficult to interpret. Users often have limited visibility into:

- how income is distributed across spending categories
- whether savings goals are realistic
- whether recurring expenses are drifting upward
- when to adjust budgets or cut unnecessary spending

FinTrack AI addresses this by turning raw financial snapshots into understandable summaries, trend analysis, and next-step guidance.

## Target Users

FinTrack AI is built for:

- young professionals managing income and monthly expenses
- freelancers and contractors balancing irregular cash flow
- households tracking recurring bills and savings habits
- users who want a clearer, more actionable picture of their finances without complex spreadsheet workflows

## Key Features

| Feature | Description |
| --- | --- |
| Executive dashboard | High-level overview of balance, income, expenses, and savings |
| Transaction insights | Recent activity and categorized financial movement |
| Spending analysis | Monthly spending breakdown by category and trend |
| Budget monitoring | Progress bars and threshold-based budget health checks |
| Savings tracking | Goal-oriented visibility into financial resilience |
| AI-generated financial review | Personalized summary, budgeting recommendations, and next steps |
| Responsive navigation | Desktop and mobile-friendly shell with collapsible menu |
| Health check views | Overall financial wellness indicators and risk signals |
| Error-aware UX | Graceful API failures and fallback insight states |
| Vercel-ready architecture | Pre-configured for deployment using environment-managed secrets |

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| UI icons | Lucide React |
| Charts | Recharts |
| AI integration | OpenRouter API, Gemini-compatible / model-based inference |
| Deployment | Vercel |
| Linting | ESLint |

## Project Architecture Overview

The app is structured around the Next.js App Router and a lightweight server-side AI proxy.

```text
fintrack-ai/
├── app/
│   ├── api/
│   │   └── insights/
│   │       └── route.ts          # AI insight endpoint and API orchestration
│   ├── analytics/
│   ├── budget/
│   ├── goals/
│   ├── health-check/
│   ├── profile/
│   ├── reports/
│   ├── settings/
│   ├── transactions/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Dashboard landing page
├── components/
│   ├── app-shell.tsx            # Sidebar and top navigation shell
│   ├── financial-insights.tsx   # AI insights UI and fallback handling
│   ├── toast-provider.tsx
│   └── ui.tsx                   # Shared UI primitives
├── public/                      # Static assets
├── .env.example                 # Sample environment variables
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── next-env.d.ts
```

### Runtime flow

1. The dashboard loads financial data into the current UI state.
2. The client calls the `/api/insights` endpoint with a sanitized payload.
3. The server validates the environment and requests insights from OpenRouter.
4. The response is parsed, normalized, and transformed into structured insight blocks.
5. The frontend renders the AI summary, recommendations, and fallback content if the external service is unavailable.

## Folder Structure

```text
app/
  analytics/
  api/
  budget/
  goals/
  health-check/
  profile/
  reports/
  settings/
  transactions/
components/
  app-shell.tsx
  financial-insights.tsx
  toast-provider.tsx
  ui.tsx
public/
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

## Environment Variables

Create a `.env.local` file in the project root based on the following example:

```env
# .env.example
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemma-3-27b-it
NEXT_PUBLIC_APP_NAME=FinTrack AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### What these variables do

- `OPENROUTER_API_KEY`: authenticates requests to the OpenRouter API.
- `OPENROUTER_MODEL`: selects the inference model used to generate financial insights.
- `NEXT_PUBLIC_APP_NAME`: app branding for client-side display.
- `NEXT_PUBLIC_APP_URL`: used in deployment and for URL-aware logic if later extended.

> Note: Keep API keys in `.env.local` and do not commit them to source control.

## AI Integration: Gemini/OpenRouter

The project uses OpenRouter as the AI gateway layer, which allows access to model providers such as Gemini or other supported large language models. The current route is configured to request a model like `google/gemma-3-27b-it` and return structured financial guidance.

### What data is sent to the model

The server sends a structured JSON payload containing:

- current balance
- income and expenses totals
- savings value
- budget progress
- top spending categories
- recent transactions with titles, categories, amounts, types, and dates
- the reporting period (for example, `last 30 days`)

This payload is normalized and filtered before being sent, reducing noise and helping the model reason on the most relevant financial signals.

### How insights are generated

The backend builds a prompt that frames the financial snapshot as a personal finance assistant. It requests a response in a structured format that includes:

- overallScore
- summary
- budgetingAdvice
- spendingSummary
- savingsRecommendations
- unusualExpenses
- financialTips
- nextSteps

The route then:

1. validates the OpenRouter response
2. extracts the JSON payload
3. normalizes malformed or partial responses
4. falls back to default safe insight values if needed

### Why this approach was chosen

This approach provides a strong capstone balance between:

- rapid AI integration without managing low-level model infrastructure directly
- access to multiple model providers and flexible routing
- a clean separation between UI and AI logic
- graceful fallback behavior for reliability and demo robustness

It also keeps the app easy to extend if the product grows to include user accounts, real transaction ingestion, or deeper personalization.

## Error Handling and Fallback Behavior

The application is designed to remain usable even when the AI provider is unavailable.

### Backend behavior

The `/api/insights` route handles:

- missing API keys
- quota or rate-limit failures
- malformed AI responses
- invalid prompt payloads

When a failure occurs, the server returns a product-safe error message and allows the frontend to show a meaningful fallback state.

### Frontend behavior

The AI insights component:

- displays a loading skeleton while the request is in progress
- shows a retry control if the AI request fails
- substitutes structured fallback insights when needed
- keeps the rest of the dashboard usable even if AI analysis is unavailable

This ensures the app remains informative and production-friendly rather than failing entirely on AI service disruption.

## Testing

At the current stage, the project is validated primarily through build and lint checks plus manual UI verification.

### Recommended commands

```bash
npm run lint
npm run build
```

### Suggested test coverage for future iterations

- route-level tests for `/api/insights`
- fallback behavior tests for missing or malformed API responses
- component tests for dashboard rendering and AI status states
- end-to-end tests for navigation and key user flows

## Deployment (Vercel)

The app is ready for deployment on Vercel.

### Steps

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the project framework to Next.js.
4. Add environment variables in the Vercel dashboard:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=google/gemma-3-27b-it
NEXT_PUBLIC_APP_NAME=FinTrack AI
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

5. Deploy the project.

### Vercel notes

- Use the production environment for secrets.
- Enable automatic deployments on pushes to the main branch.
- Keep the app stateless and environment-driven so it scales predictably.

## Screenshots

The project includes a polished dashboard experience and an AI insight panel. Placeholder previews are included below for presentation and documentation purposes.

### Dashboard overview

![Dashboard Overview Placeholder](https://placehold.co/1200x700/0f172a/ffffff?text=FinTrack+Dashboard)

### AI insights panel

![AI Insights Placeholder](https://placehold.co/1200x700/1d4ed8/ffffff?text=AI+Financial+Insights)

### Budget and analytics view

![Analytics Placeholder](https://placehold.co/1200x700/0f766e/ffffff?text=Budget+Analytics)

## Known Limitations

- AI insights are generated from demo-style financial payloads rather than live connected banking data.
- No user authentication or persistent database exists yet.
- The app currently relies on synthetic or static financial information for the dashboard experience.
- OpenRouter API usage is dependent on service availability and rate limits.
- The current design is focused on product UX and demonstration value rather than full enterprise-scale finance operations.

## Future Improvements

- user authentication and secure account management
- real transaction imports via CSV or bank APIs
- personalized goals and savings targets
- forecasting and predictive budgeting models
- alerting for unusual transactions or category drift
- richer analytics with historical trend comparisons
- support for localization, dark mode, and accessibility improvements
- stronger test coverage and CI/CD enforcement

## Credits

- Project: FinTrack AI
- Capstone: FlyRank AI Frontend Engineering Capstone
- Tech foundations: Next.js, React, TypeScript, Tailwind CSS
- AI layer: OpenRouter and model-based inference
- Design direction: modern finance dashboard UX for clarity, trust, and actionability

## License

This project is intended for educational and capstone demonstration purposes unless otherwise specified by the project owner or organization.

---

This README was improved and expanded while preserving the original project context and structure. It reflects the actual implementation of the app, including the dashboard experience and the AI insights fallback architecture.
