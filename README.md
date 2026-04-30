# SmartSplit 💸

> **An intelligent expense-splitting platform** that takes the friction out of shared finances — split bills, track balances, settle debts, and get AI-powered spending insights, all in one place.

🔗 **[Live Demo](https://smart-split-zm2f.vercel.app)** · [GitHub](https://github.com/Nibhi16/SmartSplit)

---

## Why SmartSplit?

Managing shared expenses with friends, roommates, or travel groups is messy. SmartSplit solves this with a clean, real-time interface backed by a serverless architecture — so balances update instantly, no refresh needed.

What makes it different:
- 🤖 **AI-powered insights** that analyze your spending patterns and surface what matters
- ⚡ **Real-time sync** — every expense update is reflected live across all group members
- 🧠 **Built-in chatbot assistant** to help manage and query your expenses conversationally
- 📧 **Automated reminders** via Resend so groups stay accountable without manual follow-ups

---

## Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Secure sign-in/sign-up powered by Clerk |
| 👥 Groups | Create groups, invite members, manage access |
| 💰 Expense Splitting | Split equally, by percentage, or custom amounts |
| ⚖️ Balance Tracking | Real-time view of who owes what across groups |
| 🤝 Settlements | Record payments and mark debts as settled |
| 📊 Dashboard | Unified overview of all balances and recent activity |
| 🤖 AI Chatbot | Conversational assistant for querying and managing expenses |
| 💡 Spending Insights | AI-generated analysis of group and personal spend |
| 📱 Responsive UI | Fully optimized for desktop and mobile |
| 🔔 Email Reminders | Automated scheduled notifications for pending balances — no more manual follow-ups |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Full-stack React framework with SSR and file-based routing |
| **React** | Component-based UI architecture |
| **Tailwind CSS** | Utility-first styling for rapid, consistent UI development |
| **JavaScript** | Core application language |

### Backend & Database
| Technology | Purpose |
|---|---|
| **Convex** | Real-time serverless database with live query subscriptions |
| | Serverless functions for all backend logic |
| | Handles users, groups, expenses, balances, and settlements |

### Authentication
| Technology | Purpose |
|---|---|
| **Clerk** | Complete auth solution — login, signup, session management, user profiles |

### AI & Automation
| Technology | Purpose |
|---|---|
| **Gemini API** (Google AI) | Expense insights generation and chatbot intelligence |
| **Inngest** | Async background job processing for AI workflows |
| | Ensures AI tasks run reliably without blocking the main thread |
| **Cron Jobs** | Scheduled recurring tasks for automated email reminders |
| | Periodically checks for unsettled balances and triggers notifications |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting with automatic CI/CD from GitHub |
| **Convex Cloud** | Managed backend and database hosting |

---

## System Architecture

```
┌─────────────────────────────────────────────┐
│               Next.js Frontend              │
│         (Vercel — App Router + SSR)         │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
  ┌────▼────┐ ┌────▼────┐ ┌───▼────┐
  │  Clerk  │ │ Convex  │ │Inngest │
  │  Auth   │ │Real-time│ │  Jobs  │
  └─────────┘ │Database │ └───┬────┘
              └─────────┘     │
                          ┌───▼────┐
                          │  LLM   │
                          │  API   │
                          └────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account
- A [Resend](https://resend.com) account (for email reminders)
- A [Google AI](https://aistudio.google.com) account (for Gemini API)

### Installation

```bash
# Clone the repository
git clone https://github.com/Nibhi16/SmartSplit.git
cd SmartSplit

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Convex
CONVEX_DEPLOY_KEY=your_convex_deploy_key
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
smartsplit/
├── app/
│   ├── (auth)/               # Sign-in / Sign-up pages
│   └── (main)/
│       ├── dashboard/        # Overview page with balance summary
│       ├── groups/           # Group detail pages
│       ├── expenses/         # Expense creation flow
│       ├── settlements/      # Settlement management
│       └── contacts/         # Friends and group discovery
├── components/
│   ├── chatbot/              # AI assistant UI
│   ├── ui/                   # Reusable UI components
│   └── ...                   # Feature-specific components
├── convex/                   # Backend functions and schema
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
└── public/                   # Static assets
```

---

## Key Technical Decisions

**Why Convex?**
Convex's real-time query subscriptions mean expense updates reflect instantly across all clients without manual polling or websocket management — critical for a collaborative finance app.

**Why Inngest?**
AI operations (generating insights, processing chat) are async and potentially slow. Inngest offloads these to background jobs, keeping the UI fast and preventing timeouts on serverless functions.

**Why Cron Jobs for reminders?**
Rather than relying on users to manually chase payments, scheduled cron jobs run periodically to detect unsettled balances and fire email reminders automatically — keeping groups accountable without any manual intervention.

**Why Clerk?**
Clerk handles the full auth lifecycle out of the box — social login, email magic links, session management, and user metadata — so the focus stays on product features.

---

## Roadmap

- [ ] Push notifications for new expenses and settlements
- [ ] CSV export of expense history
- [ ] Multi-currency support with live exchange rates
- [ ] Recurring expense automation
- [ ] Native mobile app (React Native)

---

## License

MIT © [Nibhi16](https://github.com/Nibhi16)
