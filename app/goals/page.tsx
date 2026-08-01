"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, Input } from "@/components/ui";

type Goal = {
  id: number;
  title: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  dueDate: string;
  color: string;
  note: string;
};

type GoalDraft = {
  title: string;
  category: string;
  targetAmount: string;
  savedAmount: string;
  monthlyContribution: string;
  dueDate: string;
  note: string;
};

const categoryOptions = ["Travel", "Emergency", "Home", "Education", "Investment", "Car", "Lifestyle"];

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Emergency Fund",
    category: "Emergency",
    targetAmount: 15000,
    savedAmount: 9800,
    monthlyContribution: 800,
    dueDate: "2027-06-15",
    color: "from-emerald-500 to-teal-500",
    note: "Keep a 6-month reserve for unexpected events.",
  },
  {
    id: 2,
    title: "Home Upgrade",
    category: "Home",
    targetAmount: 12000,
    savedAmount: 5100,
    monthlyContribution: 650,
    dueDate: "2026-12-01",
    color: "from-violet-500 to-indigo-500",
    note: "Refinishing floors and upgrading the kitchen.",
  },
  {
    id: 3,
    title: "Summer Trip",
    category: "Travel",
    targetAmount: 4000,
    savedAmount: 2600,
    monthlyContribution: 400,
    dueDate: "2026-08-20",
    color: "from-cyan-500 to-blue-500",
    note: "Planning a savings pace to cover flights and lodging.",
  },
];

const emptyDraft: GoalDraft = {
  title: "",
  category: "Travel",
  targetAmount: "",
  savedAmount: "",
  monthlyContribution: "",
  dueDate: "",
  note: "",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const calculateCompletion = (saved: number, target: number) => Math.min(100, Math.max(0, (saved / target) * 100));

const estimateCompletionDate = (saved: number, target: number, monthlyContribution: number) => {
  const remaining = Math.max(target - saved, 0);
  if (remaining <= 0 || monthlyContribution <= 0) {
    return "Goal reached";
  }

  const monthsNeeded = Math.ceil(remaining / monthlyContribution);
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsNeeded);

  return formatDate(targetDate.toISOString().slice(0, 10));
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<GoalDraft>(emptyDraft);
  const [formError, setFormError] = useState<string | null>(null);

  const totalTarget = useMemo(() => goals.reduce((sum, item) => sum + item.targetAmount, 0), [goals]);
  const totalSaved = useMemo(() => goals.reduce((sum, item) => sum + item.savedAmount, 0), [goals]);
  const totalRemaining = totalTarget - totalSaved;
  const avgCompletion = goals.length ? Math.round(goals.reduce((sum, item) => sum + calculateCompletion(item.savedAmount, item.targetAmount), 0) / goals.length) : 0;

  const openCreateModal = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10) });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingId(goal.id);
    setDraft({
      title: goal.title,
      category: goal.category,
      targetAmount: String(goal.targetAmount),
      savedAmount: String(goal.savedAmount),
      monthlyContribution: String(goal.monthlyContribution),
      dueDate: goal.dueDate,
      note: goal.note,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = () => {
    if (!draft.title.trim()) {
      setFormError("Goal title is required.");
      return;
    }

    const targetAmount = Number(draft.targetAmount);
    const savedAmount = Number(draft.savedAmount);
    const monthlyContribution = Number(draft.monthlyContribution);

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      setFormError("Target amount must be greater than zero.");
      return;
    }
    if (!Number.isFinite(savedAmount) || savedAmount < 0) {
      setFormError("Saved amount must be zero or greater.");
      return;
    }
    if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
      setFormError("Monthly contribution must be zero or greater.");
      return;
    }
    if (savedAmount > targetAmount) {
      setFormError("Saved amount cannot exceed the goal target.");
      return;
    }

    const nextGoal: Goal = {
      id: editingId ?? Date.now(),
      title: draft.title.trim(),
      category: draft.category,
      targetAmount,
      savedAmount,
      monthlyContribution,
      dueDate: draft.dueDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 10),
      color: ["from-emerald-500 to-teal-500", "from-violet-500 to-indigo-500", "from-cyan-500 to-blue-500", "from-amber-500 to-orange-500"][Math.abs((editingId ?? Date.now()) % 4)],
      note: draft.note.trim() || "Keep moving steadily toward the finish line.",
    };

    if (editingId) {
      setGoals((current) => current.map((item) => (item.id === editingId ? nextGoal : item)));
    } else {
      setGoals((current) => [nextGoal, ...current]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Delete this goal?");
    if (!confirmed) return;
    setGoals((current) => current.filter((item) => item.id !== id));
  };

  return (
    <AppShell title="Goals">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Total target</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(totalTarget)}</p>
            <p className="mt-2 text-xs text-slate-400">{goals.length} active goals</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Saved so far</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(totalSaved)}</p>
            <p className="mt-2 text-xs text-emerald-600">+{formatCurrency(totalSaved / Math.max(goals.length, 1))} avg / goal</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Remaining</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(totalRemaining)}</p>
            <p className="mt-2 text-xs text-slate-400">Across all goals</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Progress</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{avgCompletion}%</p>
            <p className="mt-2 text-xs text-violet-600">Average completion</p>
          </Card>
        </section>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Savings tracker</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">My goals</h2>
            </div>
            <Button onClick={openCreateModal}>+ Add goal</Button>
          </div>

          {goals.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg font-medium text-slate-700">No goals yet</p>
              <p className="mt-2 text-sm text-slate-500">Create your first savings goal to start tracking milestones.</p>
              <div className="mt-5 flex justify-center">
                <Button onClick={openCreateModal}>Create goal</Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {goals.map((goal) => {
                const completion = calculateCompletion(goal.savedAmount, goal.targetAmount);
                const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);
                const nextMilestone = [25, 50, 75, 100].find((value) => completion < value) ?? 100;
                const goalAdvice =
                  completion >= 100
                    ? "Goal achieved. Consider redirecting this monthly contribution to a new target."
                    : completion >= 75
                      ? "You are in the final stretch—keep the momentum strong and celebrate the milestone."
                      : completion >= 50
                        ? "You are halfway there. A small extra monthly transfer could shorten your timeline."
                        : "You have a strong start. Increase your monthly contribution slightly to reach your milestone sooner.";

                return (
                  <div key={goal.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${goal.color} text-lg font-semibold text-white`}>
                          {goal.title[0]}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{goal.title}</h3>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{goal.category}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(goal)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(goal.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                      <span>{formatCurrency(goal.savedAmount)} saved</span>
                      <span>{Math.round(completion)}%</span>
                    </div>

                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${goal.color}`} style={{ width: `${completion}%` }} />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Target</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{formatCurrency(goal.targetAmount)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Remaining</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{formatCurrency(remaining)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Est. date</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{estimateCompletionDate(goal.savedAmount, goal.targetAmount, goal.monthlyContribution)}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-600">Milestones</span>
                        <span className="font-medium text-slate-900">Next: {nextMilestone}%</span>
                      </div>
                      <div className="flex gap-2">
                        {[25, 50, 75, 100].map((milestone) => {
                          const reached = completion >= milestone;
                          return (
                            <div key={milestone} className="flex-1">
                              <div className={`h-2 w-full rounded-full ${reached ? "bg-emerald-500" : "bg-slate-200"}`} />
                              <p className="mt-2 text-[10px] font-medium text-slate-500">{milestone}%</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">AI suggestion</p>
                      <p className="mt-2 text-sm leading-6 text-emerald-900">{goalAdvice}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                      <span>Monthly contribution</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(goal.monthlyContribution)}</span>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">Target date: {formatDate(goal.dueDate)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="goal-modal-title">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Goal</p>
                <h3 id="goal-modal-title" className="text-xl font-semibold text-slate-900">
                  {editingId ? "Edit goal" : "Create goal"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                aria-label="Close goal form"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                <span>Goal title</span>
                <Input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="e.g. Emergency fund"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Category</span>
                <select
                  value={draft.category}
                  onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Target amount</span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={draft.targetAmount}
                  onChange={(event) => setDraft((current) => ({ ...current, targetAmount: event.target.value }))}
                  placeholder="5000"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Saved amount</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.savedAmount}
                  onChange={(event) => setDraft((current) => ({ ...current, savedAmount: event.target.value }))}
                  placeholder="1500"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Monthly contribution</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.monthlyContribution}
                  onChange={(event) => setDraft((current) => ({ ...current, monthlyContribution: event.target.value }))}
                  placeholder="300"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Target date</span>
                <Input
                  type="date"
                  value={draft.dueDate}
                  onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                <span>Note</span>
                <textarea
                  rows={3}
                  value={draft.note}
                  onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                  placeholder="A short motivation note"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </label>
            </div>

            {formError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {formError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>{editingId ? "Save changes" : "Create goal"}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
