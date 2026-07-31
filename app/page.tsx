"use client";

import { AppShell } from "@/components/app-shell";
import { Button, Card, SearchBar, SectionHeader, StatCard } from "@/components/ui";

const navItems = [
  { name: "Dashboard", href: "/", badge: "12" },
  { name: "Transactions", href: "/transactions" },
  { name: "Budget", href: "/budget" },
  { name: "Analytics", href: "/analytics" },
  { name: "Goals", href: "/goals" },
  { name: "Reports", href: "/reports" },
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
  { name: "Health Check", href: "/health-check" },
];

const stats = [
  { label: "Total Balance", value: "$24,860.00", trend: "+12.4%", tone: "bg-blue-50 text-blue-700" },
  { label: "Income", value: "$8,450.00", trend: "+5.1%", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Expenses", value: "$3,420.00", trend: "-2.6%", tone: "bg-rose-50 text-rose-700" },
  { label: "Savings", value: "$2,680.00", trend: "+18.7%", tone: "bg-violet-50 text-violet-700" },
];

const transactions = [
  { name: "Salary Deposit", category: "Income", amount: "+$3,200.00", time: "Today, 09:15" },
  { name: "Freelance Payment", category: "Income", amount: "+$1,150.00", time: "Yesterday" },
  { name: "Groceries", category: "Food", amount: "-$186.42", time: "Yesterday, 18:40" },
  { name: "Rent", category: "Housing", amount: "-$1,200.00", time: "Mon, 08:00" },
  { name: "Electric Bill", category: "Utilities", amount: "-$94.80", time: "Sun, 11:10" },
];

const budgets = [
  { label: "Operations", value: "$24,000", used: 72, color: "bg-violet-500" },
  { label: "Marketing", value: "$16,000", used: 48, color: "bg-blue-500" },
  { label: "Payroll", value: "$38,000", used: 81, color: "bg-emerald-500" },
];

const healthStatus = [
  { label: "Cash reserve", status: "Strong" },
  { label: "Expense variance", status: "On track" },
  { label: "Payment timeliness", status: "99.2%" },
  { label: "Risk exposure", status: "Low" },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "stroke-white" : "stroke-slate-400";

  switch (name) {
    case "Dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M3 12.75V5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v7.25" />
          <path d="M3 18.5A2.5 2.5 0 0 0 5.5 21h13A2.5 2.5 0 0 0 21 18.5v-2.75H3z" />
          <path d="M8 12h8" />
        </svg>
      );
    case "Transactions":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "Budget":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M6 19V9m6 10V5m6 14v-8" />
          <path d="M4 19h16" />
        </svg>
      );
    case "Analytics":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M5 18L10.5 12.5L14 16L19 9" />
          <path d="M19 9h-4.5V5" />
        </svg>
      );
    case "Goals":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M12 3v4M12 17v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M3 12h4M17 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case "Reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "Profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19.25c1.3-2.7 4-4.25 7-4.25s5.7 1.55 7 4.25" />
        </svg>
      );
    case "Settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M12 3.75v2.5M12 17.75v2.5M4.75 12h2.5M16.75 12h2.5M6.7 6.7l1.77 1.77M15.53 15.53l1.77 1.77M6.7 17.3l1.77-1.77M15.53 8.47l1.77-1.77" />
          <circle cx="12" cy="12" r="3.25" />
        </svg>
      );
    case "Health Check":
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className={`h-4 w-4 ${stroke}`}>
          <path d="M12 20.5c4.8-3.1 8-6.2 8-10.5A4.5 4.5 0 0 0 15.5 5a4.9 4.9 0 0 0-3.5 1.6A4.9 4.9 0 0 0 8.5 5 4.5 4.5 0 0 0 4 10c0 4.3 3.2 7.4 8 10.5z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  return (
    <AppShell
      headerAction={
        <div className="hidden md:block">
          <SearchBar placeholder="Search" className="w-56" />
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            trend={item.trend}
            tone={item.tone}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <SectionHeader
            eyebrow="Cash flow"
            title="Performance overview"
            action={<Button variant="secondary" size="sm" className="rounded-full">30 days</Button>}
          />

          <div className="flex h-56 items-end gap-3">
            {[32, 48, 40, 64, 58, 86, 75, 94, 70, 84].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className={`w-full rounded-t-2xl ${index % 2 === 0 ? "bg-gradient-to-t from-blue-600 to-cyan-400" : "bg-gradient-to-t from-violet-600 to-indigo-400"}`} style={{ height: `${height}%` }} />
                <span className="text-[10px] text-slate-400">{["J","F","M","A","M","J","J","A","S","O"][index]}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Portfolio health</p>
              <h2 className="mt-1 text-2xl font-semibold">Operating status</h2>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              Healthy
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {healthStatus.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <SectionHeader
            eyebrow="Latest activity"
            title="Recent Transactions"
            action={<button className="text-sm font-medium text-blue-600">View all</button>}
          />

          <div className="space-y-3">
            {transactions.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-slate-900">{entry.name}</p>
                  <p className="text-xs text-slate-500">{entry.category} • {entry.time}</p>
                </div>
                <span className={`text-sm font-semibold ${entry.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeader eyebrow="Budget allocation" title="Current plan" />

          <div className="space-y-5">
            {budgets.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.used}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
