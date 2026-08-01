"use client";

import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Lightbulb,
  PiggyBank,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

export type InsightBlock = {
  overallScore: number;
  summary: string;
  budgetingAdvice: string[];
  spendingSummary: string[];
  savingsRecommendations: string[];
  unusualExpenses: string[];
  financialTips: string[];
  nextSteps: string[];
};

const defaultPayload = {
  balance: 12680,
  income: 8450,
  expenses: 3420,
  savings: 2680,
  budgetProgress: 72,
  spendingPatterns: [
    { category: "Housing", amount: 1280 },
    { category: "Food", amount: 620 },
    { category: "Transport", amount: 320 },
    { category: "Utilities", amount: 240 },
    { category: "Entertainment", amount: 410 },
    { category: "Shopping", amount: 340 },
  ],
  recentTransactions: [
    { title: "Salary Deposit", category: "Income", amount: 4200, type: "income", date: "2026-07-29" },
    { title: "Rent", category: "Housing", amount: 1280, type: "expense", date: "2026-07-28" },
    { title: "Groceries", category: "Food", amount: 220, type: "expense", date: "2026-07-26" },
    { title: "Streaming Bundle", category: "Entertainment", amount: 58, type: "expense", date: "2026-07-22" },
  ],
  period: "last 30 days",
};

const skeletonItems = ["budgeting", "spending", "savings", "anomalies"] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatScore(score: number) {
  return `${score}/100`;
}

export function FinancialInsights() {
  const [data, setData] = useState<InsightBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadInsights() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(defaultPayload),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load AI insights.");
        }

        if (isMounted) {
          if (payload.message && !payload.insights) {
            setData(null);
            setError(payload.message);
            return;
          }

          setData(payload.insights ?? null);
          setError(null);
        }
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Unable to generate financial insights.";
        if (isMounted) {
          setError(message);
          setData({
            overallScore: 82,
            summary: "Your profile is stable, but there is still room to improve the savings rate and limit lifestyle spending drift.",
            budgetingAdvice: ["Keep fixed costs under 55% of monthly income.", "Build a 10% buffer into your monthly plan for annual and irregular costs."],
            spendingSummary: ["Core spending is consistent with your current income profile.", "The largest category remains housing, followed by food and entertainment."],
            savingsRecommendations: ["Automate a transfer equal to 15% of income into savings.", "Prioritize a dedicated emergency reserve before larger discretionary goals."],
            unusualExpenses: ["No major anomalies detected, but subscription and entertainment spending should be reviewed weekly."],
            financialTips: ["Use a weekly spending checkpoint to catch drift before month-end.", "Review any purchase above 2% of monthly income against your budget."],
            nextSteps: ["Increase savings by 2% next month if cash flow remains steady.", "Review one recurring expense every week and renegotiate if necessary."],
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInsights();
    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  const insight = data;

  return (
    <section className="mt-6 rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-[0_18px_42px_rgba(15,23,42,0.2)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            <BrainCircuit className="h-4 w-4" />
            AI financial insights
          </div>
          <h2 className="text-2xl font-semibold text-white">Personalized money guidance</h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100">
          <Sparkles className="h-4 w-4" />
          {loading ? "Analyzing finances" : `Health score ${insight ? formatScore(insight.overallScore) : "82/100"}`}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {["score", "summary", "budget"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                <div className="mb-3 h-3 w-20 rounded-full bg-white/10" />
                <div className="h-8 w-full rounded-xl bg-white/10" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {skeletonItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                <div className="mb-3 h-3 w-32 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-white/10" />
                  <div className="h-3 w-5/6 rounded-full bg-white/10" />
                  <div className="h-3 w-4/6 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {error ? (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-100 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setRetryKey((value) => value + 1)}
                className="rounded-xl border border-amber-300/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/20"
              >
                Retry
              </button>
            </div>
          ) : null}

          {insight ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <TrendingUp className="h-4 w-4 text-emerald-300" />
                      Financial health
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      {formatScore(insight.overallScore)}
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-medium leading-7 text-slate-100">{insight.summary}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Wallet className="h-4 w-4 text-cyan-300" />
                    Snapshot
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-slate-200">
                    <div className="flex items-center justify-between">
                      <span>Income</span>
                      <strong>{formatCurrency(defaultPayload.income)}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Expenses</span>
                      <strong>{formatCurrency(defaultPayload.expenses)}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Savings</span>
                      <strong>{formatCurrency(defaultPayload.savings)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <InsightGroup
                  icon={<PiggyBank className="h-4 w-4 text-cyan-300" />}
                  title="Budgeting advice"
                  items={insight.budgetingAdvice}
                />
                <InsightGroup
                  icon={<TrendingDown className="h-4 w-4 text-violet-300" />}
                  title="Spending summary"
                  items={insight.spendingSummary}
                />
                <InsightGroup
                  icon={<Sparkles className="h-4 w-4 text-emerald-300" />}
                  title="Savings recommendations"
                  items={insight.savingsRecommendations}
                />
                <InsightGroup
                  icon={<AlertTriangle className="h-4 w-4 text-amber-300" />}
                  title="Unusual expenses"
                  items={insight.unusualExpenses}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <InsightGroup
                  icon={<Lightbulb className="h-4 w-4 text-yellow-300" />}
                  title="Financial tips"
                  items={insight.financialTips}
                />
                <InsightGroup
                  icon={<ArrowRight className="h-4 w-4 text-blue-300" />}
                  title="Next steps"
                  items={insight.nextSteps}
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function InsightGroup({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        {icon}
        {title}
      </div>
      <ul className="space-y-2 text-sm leading-6 text-slate-200">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
