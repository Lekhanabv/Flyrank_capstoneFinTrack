"use client";

import { AppShell } from "@/components/app-shell";
import { FinancialInsights } from "@/components/financial-insights";
import { Button, Card, SearchBar, SectionHeader } from "@/components/ui";

const stats = [
  {
    label: "Balance",
    value: "$24,860.00",
    trend: "+12.4%",
    tone: "bg-blue-50 text-blue-700",
    detail: "Available cash",
  },
  {
    label: "Income",
    value: "$8,450.00",
    trend: "+5.1%",
    tone: "bg-emerald-50 text-emerald-700",
    detail: "This month",
  },
  {
    label: "Expenses",
    value: "$3,420.00",
    trend: "-2.6%",
    tone: "bg-rose-50 text-rose-700",
    detail: "vs last month",
  },
  {
    label: "Savings",
    value: "$2,680.00",
    trend: "+18.7%",
    tone: "bg-violet-50 text-violet-700",
    detail: "Emergency fund",
  },
];

const transactions = [
  { name: "Salary Deposit", category: "Income", amount: "+$3,200.00", time: "Today, 09:15", positive: true },
  { name: "Freelance Payment", category: "Income", amount: "+$1,150.00", time: "Yesterday", positive: true },
  { name: "Grocery Run", category: "Food", amount: "-$186.42", time: "Yesterday, 18:40", positive: false },
  { name: "Rent", category: "Housing", amount: "-$1,200.00", time: "Mon, 08:00", positive: false },
  { name: "Electric Bill", category: "Utilities", amount: "-$94.80", time: "Sun, 11:10", positive: false },
];

const monthlySpending = [
  { month: "Jan", value: 38 },
  { month: "Feb", value: 54 },
  { month: "Mar", value: 46 },
  { month: "Apr", value: 63 },
  { month: "May", value: 58 },
  { month: "Jun", value: 74 },
  { month: "Jul", value: 68 },
  { month: "Aug", value: 82 },
];

const categoryBreakdown = [
  { label: "Housing", amount: "$1,280", share: 38, color: "bg-violet-500" },
  { label: "Food", amount: "$620", share: 19, color: "bg-blue-500" },
  { label: "Transport", amount: "$320", share: 10, color: "bg-cyan-500" },
  { label: "Utilities", amount: "$240", share: 7, color: "bg-emerald-500" },
  { label: "Entertainment", amount: "$410", share: 12, color: "bg-amber-400" },
  { label: "Shopping", amount: "$340", share: 14, color: "bg-rose-400" },
];

const budgets = [
  { label: "Housing", value: "$1,280", used: 72, color: "bg-violet-500" },
  { label: "Food", value: "$620", used: 58, color: "bg-blue-500" },
  { label: "Lifestyle", value: "$760", used: 43, color: "bg-emerald-500" },
];

const healthStatus = [
  { label: "Cash reserve", status: "Strong" },
  { label: "Expense variance", status: "On track" },
  { label: "Payment timeliness", status: "99.2%" },
  { label: "Risk exposure", status: "Low" },
];

export default function Home() {
  return (
    <AppShell
      headerAction={
        <div className="hidden md:block">
          <SearchBar placeholder="Search transactions" className="w-64" />
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</h3>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.tone}`}>{item.trend}</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">{item.detail}</p>
          </div>
        ))}
      </section>

      <FinancialInsights />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Cash flow</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Monthly spending</h2>
            </div>
            <Button variant="secondary" size="sm" className="rounded-full">30 days</Button>
          </div>

          <div className="flex h-64 items-end gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            {monthlySpending.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center justify-end gap-3">
                <div className="flex w-full items-end justify-center rounded-t-2xl bg-gradient-to-t from-blue-600 via-cyan-500 to-indigo-400 shadow-[0_8px_20px_rgba(59,130,246,0.25)]" style={{ height: `${item.value}%` }} />
                <span className="text-[10px] font-medium text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <SectionHeader eyebrow="Budget" title="Budget progress" />
            <div className="space-y-5">
              {budgets.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.used}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_18px_32px_rgba(15,23,42,0.12)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Financial health</p>
                <h2 className="mt-1 text-2xl font-semibold">86 / 100</h2>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                Strong
              </span>
            </div>

            <div className="mt-5 flex items-center gap-5">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(#22c55e_0_86%,rgba(255,255,255,0.08)_86%)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  86
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {healthStatus.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4">
                    <span>{item.label}</span>
                    <span className="font-medium text-white">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 sm:p-6">
          <SectionHeader eyebrow="Breakdown" title="Category breakdown" action={<button className="text-sm font-medium text-blue-600">This month</button>} />

          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.amount}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeader eyebrow="Latest activity" title="Recent transactions" action={<button className="text-sm font-medium text-blue-600">View all</button>} />

          <div className="space-y-3">
            {transactions.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-slate-900">{entry.name}</p>
                  <p className="text-[11px] text-slate-500">{entry.category} • {entry.time}</p>
                </div>
                <span className={`text-sm font-semibold ${entry.positive ? "text-emerald-600" : "text-slate-900"}`}>
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
