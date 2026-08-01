import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

// ─── Module Card Data ───────────────────────────────────────────────────────

const MODULES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    title: "Document AI",
    description:
      "OCR + LLM extracts data from invoices, contracts, GST returns, PAN cards, and bank statements automatically. No manual data entry.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: "AI Assistant",
    description:
      'Ask natural-language questions: "What\'s due this week?", "Show me unpaid invoices", "Are we compliant for GST filing?" — get instant answers.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: "Compliance Calendar",
    description:
      "Automated deadlines for GST, TDS, PF, ESIC, ROC, Income Tax, DPDP Act, and ISO audits. Never miss a filing with smart reminders.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: "Financial Dashboard",
    description:
      "Real-time view of revenue, expenses, cash flow, burn rate, and runway. Connect bank accounts and accounting software for live insights.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    title: "HR Dashboard",
    description:
      "Manage leaves, payroll, joining, exit, and offer letters. Automated compliance for PF, ESIC, and professional tax filings.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Vendor Risk Score",
    description:
      "AI-driven risk scoring: late payments, compliance track record, fraud detection patterns. Make smarter vendor decisions with data.",
  },
];

// ─── Pricing Data ────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Starter",
    price: "₹3,999",
    period: "/month",
    description: "For small businesses getting started with compliance automation.",
    features: [
      "Up to 10 employees",
      "Compliance calendar (GST, TDS, PF, ESIC)",
      "Document AI (100 docs/month)",
      "AI Assistant (basic queries)",
      "Financial dashboard",
      "Email reminders",
      "Single user",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹12,999",
    period: "/month",
    description: "For growing teams that need end-to-end business intelligence.",
    features: [
      "Up to 100 employees",
      "Everything in Starter, plus:",
      "HR dashboard (leave, payroll, onboarding)",
      "Vendor risk scoring",
      "Document AI (500 docs/month)",
      "AI Assistant (advanced queries)",
      "WhatsApp & email reminders",
      "Up to 5 users",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "₹35,000",
    period: "/month",
    description: "For established businesses with complex compliance needs.",
    features: [
      "Unlimited employees",
      "Everything in Professional, plus:",
      "Custom compliance workflows",
      "DPDP Act compliance module",
      "ISO audit readiness tracking",
      "Unlimited Document AI",
      "Dedicated account manager",
      "API access & custom integrations",
      "Unlimited users",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="min-h-dvh">
      {/* ─── Nav ──────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              ComplyOS
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#problem" className="transition-colors hover:text-brand-600">
              Problem
            </a>
            <a href="#product" className="transition-colors hover:text-brand-600">
              Product
            </a>
            <a href="#pricing" className="transition-colors hover:text-brand-600">
              Pricing
            </a>
          </div>
          <a
            href="#cta"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.97]"
          >
            Get Early Access
          </a>
        </nav>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pb-32 sm:pt-36">
        <div className="gradient-blob pointer-events-none absolute inset-0" />
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-700 ring-1 ring-brand-200/50">
            AI-Native Compliance Platform for Indian SMEs
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            The Operating System
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              for Your Business
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            One AI-native dashboard that replaces Excel, email, ERPs, and CAs for
            compliance and operations. Connect documents, workflows, compliance
            calendars, and financial data into a single pane of glass.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-200 active:scale-[0.97]"
            >
              Get Early Access
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.97]"
            >
              See how it works
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
              </svg>
            </a>
          </div>
          {/* Social proof mini */}
          <p className="mt-8 text-sm text-gray-500">
            Join 500+ Indian SMEs already on the waitlist
          </p>
        </div>
        {/* Dashboard preview placeholder */}
        <div className="mx-auto mt-16 max-w-5xl px-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
            <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs font-medium text-gray-400">dashboard.complyos.app</span>
            </div>
            <div className="grid grid-cols-4 gap-0.5 bg-gray-100 p-0.5">
              <div className="col-span-3 rounded-lg bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Compliance Calendar</h3>
                  <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">All clear</span>
                </div>
                <div className="space-y-2">
                  {["GST Return (GSTR-3B)", "TDS Return (Form 24Q)", "PF ECR"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                      <div className="h-2 w-2 rounded-full bg-accent-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                      <span className="ml-auto text-xs text-gray-400">Due in 12 days</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <h3 className="mb-3 text-xs font-semibold text-gray-900">Quick Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Revenue (MTD)</p>
                    <p className="text-lg font-bold text-gray-900">₹42.5L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Upcoming</p>
                    <p className="text-lg font-bold text-gray-900">7</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Risk Score</p>
                    <p className="text-lg font-bold text-accent-600">92</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-3">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-accent-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  All filings on track
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                  AI copilot active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Logos / Trusted by ────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium text-gray-500">Trusted by high-growth Indian companies</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm font-semibold text-gray-400">
            <span className="text-lg">Razorpay</span>
            <span className="text-lg">Groww</span>
            <span className="text-lg">CRED</span>
            <span className="text-lg">Zerodha</span>
            <span className="text-lg">Urban Company</span>
            <span className="text-lg">BharatPe</span>
          </div>
        </div>
      </section>

      {/* ─── Problem ───────────────────────────────────────────────── */}
      <section id="problem" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200/50">
              The Problem
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your business data is scattered everywhere
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Excel sheets, email threads, CA meetings, WhatsApp groups, and ERPs —
              none of them talk to each other. Business owners have no single source
              of truth.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "📊",
                title: "Excel Chaos",
                desc: "Multiple spreadsheets with outdated data. Invoices here, payroll there, compliance somewhere else. Nothing reconciles.",
              },
              {
                emoji: "📧",
                title: "Email Overload",
                desc: "Invoices buried in inbox, compliance reminders lost in spam, approvals sitting in drafts. No central view.",
              },
              {
                emoji: "👨‍💼",
                title: "CA Dependency",
                desc: "Waiting days for your CA to confirm deadlines. Endless back-and-forth on basic compliance questions. Expensive hourly billing.",
              },
              {
                emoji: "💬",
                title: "WhatsApp Fragments",
                desc: "Critical business info scattered across WhatsApp chats. Receipts, approvals, reports — gone when you need them.",
              },
              {
                emoji: "🏗️",
                title: "ERP Overkill",
                desc: "Enterprise ERPs are too expensive, complex, and need dedicated IT staff. SMEs need something simpler.",
              },
              {
                emoji: "⚠️",
                title: "Missed Deadlines",
                desc: "Late GST filing leads to penalties. Missed PF payment attracts interest. Expired contracts cost revenue. It adds up fast.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-md hover:shadow-red-100/30"
              >
                <span className="text-2xl">{item.emoji}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Solution / Product ────────────────────────────────────── */}
      <section id="product" className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200/50">
              The Solution
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              One AI Dashboard to run your entire business
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              ComplyOS connects every aspect of your business into a single,
              intelligent platform. Your AI copilot handles the rest.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <div
                key={mod.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                  {mod.icon}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{mod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{mod.description}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mx-auto mt-20 max-w-4xl">
            <h3 className="text-center text-2xl font-bold text-gray-900">
              How it works
            </h3>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Connect",
                  desc: "Link your accounts — bank, GST portal, PF portal, email — in one click.",
                },
                {
                  step: "02",
                  title: "Organize",
                  desc: "Our AI extracts, categorizes, and structures all your data automatically.",
                },
                {
                  step: "03",
                  title: "Never Miss a Beat",
                  desc: "Get smart reminders, AI insights, and a complete dashboard of your business health.",
                },
              ].map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-700 ring-1 ring-brand-200/50">
                    {step.step}
                  </div>
                  <h4 className="mt-4 font-semibold text-gray-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid (extra) ──────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built specifically for Indian SMEs. Comprehensive compliance coverage,
              beautiful dashboards, and AI-powered insights.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🇮🇳", title: "India-First", desc: "GST, TDS, PF, ESIC, ROC, DPDP — fully compliant with Indian regulations." },
              { icon: "🤖", title: "AI-Powered", desc: "LLM-based extraction, smart scheduling, predictive risk analysis, natural language queries." },
              { icon: "🔒", title: "Bank-Grade Security", desc: "SOC 2 compliant, end-to-end encryption, role-based access control." },
              { icon: "📱", title: "Mobile Ready", desc: "Access everything on the go. WhatsApp bot for quick queries and reminders." },
              { icon: "🔄", title: "Integrations", desc: "Connect with Razorpay, Zoho, Tally, QuickBooks, and 50+ more tools." },
              { icon: "📊", title: "Custom Reports", desc: "Generate compliance reports, financial summaries, and audit-ready exports in one click." },
              { icon: "👥", title: "Team Collaboration", desc: "Role-based access for your team, CA, and accountants. Share with stakeholders." },
              { icon: "🎯", title: "Zero Learning Curve", desc: "Designed for business owners, not tech teams. Start in under 10 minutes." },
            ].map((feat) => (
              <div key={feat.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <span className="text-2xl">{feat.icon}</span>
                <h3 className="mt-3 font-semibold text-gray-900">{feat.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200/50">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No hidden fees. No setup costs. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                  plan.highlighted
                    ? "border-brand-200 ring-2 ring-brand-500/20 scale-[1.02] lg:scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-semibold shadow-sm transition-all active:scale-[0.97] ${
                    plan.highlighted
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────── */}
      <section id="cta" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-16 text-center shadow-xl sm:px-16 sm:py-24">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to never miss a compliance deadline again?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Join 500+ Indian SMEs using ComplyOS to automate compliance, track
                finances, and run their business from one dashboard.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.97]"
                >
                  Start Free Trial
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <p className="text-sm text-brand-200">No credit card required · Free for 14 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
                C
              </div>
              <span className="text-sm font-semibold text-gray-900">ComplyOS</span>
            </div>
            <p className="text-center text-sm text-gray-500">
              The AI-native operating system for Indian SMEs. Simplify compliance.
              Unlock growth.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>© 2026 ComplyOS</span>
              <span className="h-3 w-px bg-gray-200" />
              <span>Privacy</span>
              <span className="h-3 w-px bg-gray-200" />
              <span>Terms</span>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-400">
            Built with{" "}
            <a href="https://cto.new" className="underline hover:text-gray-600">
              cto.new
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}