"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

const spendingTrend = [
  { month: "Jan", income: 6800, expenses: 4200, savings: 2600 },
  { month: "Feb", income: 6950, expenses: 4350, savings: 2600 },
  { month: "Mar", income: 7200, expenses: 4520, savings: 2680 },
  { month: "Apr", income: 7500, expenses: 4700, savings: 2800 },
  { month: "May", income: 7900, expenses: 4620, savings: 3280 },
  { month: "Jun", income: 8450, expenses: 3420, savings: 2680 },
];

const categoryData = [
  { name: "Housing", value: 1280, color: "#7C3AED" },
  { name: "Food", value: 620, color: "#3B82F6" },
  { name: "Utilities", value: 240, color: "#14B8A6" },
  { name: "Transport", value: 320, color: "#06B6D4" },
  { name: "Entertainment", value: 410, color: "#F59E0B" },
  { name: "Shopping", value: 340, color: "#F87171" },
];

const weeklySpend = [
  { name: "Mon", value: 260 },
  { name: "Tue", value: 180 },
  { name: "Wed", value: 320 },
  { name: "Thu", value: 240 },
  { name: "Fri", value: 490 },
  { name: "Sat", value: 620 },
  { name: "Sun", value: 310 },
];

const savingsBreakdown = [
  { name: "Emergency Fund", value: 42 },
  { name: "Retirement", value: 28 },
  { name: "Travel", value: 17 },
  { name: "Short-term Goals", value: 13 },
];

const topSpendingCategories = [
  { label: "Housing", value: "$1,280", delta: "+4.2%" },
  { label: "Food", value: "$620", delta: "+1.1%" },
  { label: "Entertainment", value: "$410", delta: "+6.4%" },
  { label: "Shopping", value: "$340", delta: "+2.8%" },
];

const savingsPercentage = 38;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTooltipCurrency(value: unknown) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return formatMoney(Number(normalized ?? 0));
}

function formatTooltipPercent(value: unknown) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return `${Number(normalized ?? 0)}%`;
}

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Savings rate</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-slate-900">{savingsPercentage}%</p>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">+2.4%</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">Above your target</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Monthly spend</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-slate-900">{formatMoney(3420)}</p>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">-2.6%</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">Compared to last month</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Net cash flow</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-slate-900">{formatMoney(5030)}</p>
              <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">Healthy</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">Income vs expenses</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Budget usage</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-slate-900">72%</p>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">On plan</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">Within your monthly cap</p>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <Card className="p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Trend analysis</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Monthly spending trends</h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                2026
              </span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingTrend} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="income" radius={[6, 6, 0, 0]} fill="#0F172A" />
                  <Bar dataKey="expenses" radius={[6, 6, 0, 0]} fill="#3B82F6" />
                  <Bar dataKey="savings" radius={[6, 6, 0, 0]} fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Allocation</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Savings split</h2>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={savingsBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={2}>
                    {savingsBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'][index % 4]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipPercent} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 space-y-3">
              {savingsBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'][index % 4] }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="p-5 sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Category analysis</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Top spending categories</h2>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={82} paddingAngle={3}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipCurrency} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Weekly pattern</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Daily spending</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">This week</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-sm text-slate-500">Insights</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Top spending categories</h2>
            </div>

            <div className="space-y-4">
              {topSpendingCategories.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">Monthly total</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs text-emerald-600">{item.delta}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-sm text-slate-500">Breakdown</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Expense distribution</h2>
            </div>

            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{formatMoney(item.value)}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${Math.max((item.value / 1280) * 100, 12)}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
