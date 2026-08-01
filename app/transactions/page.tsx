"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, Input } from "@/components/ui";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  title: string;
  category: string;
  type: TransactionType;
  amount: number;
  date: string;
  note: string;
};

type DraftTransaction = {
  title: string;
  category: string;
  type: TransactionType;
  amount: string;
  date: string;
  note: string;
};

const categoryOptions = [
  "All",
  "Housing",
  "Food",
  "Utilities",
  "Transport",
  "Entertainment",
  "Shopping",
  "Salary",
  "Freelance",
  "Insurance",
  "Travel",
];

const initialTransactions: Transaction[] = [
  { id: 1, title: "Salary Deposit", category: "Salary", type: "income", amount: 3200, date: "2026-07-30", note: "Monthly payroll" },
  { id: 2, title: "Freelance Invoice", category: "Freelance", type: "income", amount: 1150, date: "2026-07-28", note: "Design retainer" },
  { id: 3, title: "Groceries", category: "Food", type: "expense", amount: 186.42, date: "2026-07-27", note: "Weekly grocery run" },
  { id: 4, title: "Rent", category: "Housing", type: "expense", amount: 1200, date: "2026-07-25", note: "Apartment rent" },
  { id: 5, title: "Electric Bill", category: "Utilities", type: "expense", amount: 94.8, date: "2026-07-20", note: "Power usage" },
  { id: 6, title: "Train Pass", category: "Transport", type: "expense", amount: 62.5, date: "2026-07-18", note: "City commute" },
  { id: 7, title: "Concert Tickets", category: "Entertainment", type: "expense", amount: 128, date: "2026-07-15", note: "Weekend event" },
  { id: 8, title: "Shopping", category: "Shopping", type: "expense", amount: 220.3, date: "2026-07-12", note: "Home items" },
  { id: 9, title: "Insurance Premium", category: "Insurance", type: "expense", amount: 340, date: "2026-07-10", note: "Auto insurance" },
  { id: 10, title: "Flight Booking", category: "Travel", type: "expense", amount: 580, date: "2026-07-08", note: "Summer trip" },
  { id: 11, title: "Bonus", category: "Salary", type: "income", amount: 900, date: "2026-06-22", note: "Performance bonus" },
  { id: 12, title: "Coffee Shop", category: "Food", type: "expense", amount: 28.5, date: "2026-06-18", note: "Team meeting" },
];

const fmtCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const fmtDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const emptyDraft: DraftTransaction = {
  title: "",
  category: "Food",
  type: "expense",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftTransaction>(emptyDraft);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setTransactions(initialTransactions);
        setLoading(false);
        setError(null);
      } catch {
        setLoading(false);
        setError("Something went wrong while loading transactions.");
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [retryKey]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = transactions.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.note.toLowerCase().includes(normalizedSearch);

      const matchesCategory = category === "All" || item.category === category;

      const matchesDateFrom = !dateFrom || item.date >= dateFrom;
      const matchesDateTo = !dateTo || item.date <= dateTo;

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });

    filtered.sort((a, b) => {
      const primary = sortField === "amount" ? a.amount - b.amount : new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDirection === "asc" ? primary : -primary;
    });

    return filtered;
  }, [category, dateFrom, dateTo, search, sortDirection, sortField, transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreateModal = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft, date: new Date().toISOString().slice(0, 10) });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Transaction) => {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      category: item.category,
      type: item.type,
      amount: String(item.amount),
      date: item.date,
      note: item.note,
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
      setFormError("Transaction title is required.");
      return;
    }
    if (!draft.date) {
      setFormError("Please provide a transaction date.");
      return;
    }
    const parsedAmount = Number(draft.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Amount must be greater than zero.");
      return;
    }

    const nextTransaction: Transaction = {
      id: editingId ?? Date.now(),
      title: draft.title.trim(),
      category: draft.category,
      type: draft.type,
      amount: parsedAmount,
      date: draft.date,
      note: draft.note.trim(),
    };

    if (editingId) {
      setTransactions((current) =>
        current.map((item) => (item.id === editingId ? nextTransaction : item)),
      );
    } else {
      setTransactions((current) => [nextTransaction, ...current]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) return;

    setTransactions((current) => current.filter((item) => item.id !== id));
    setError(null);
  };

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const netFlow = totalIncome - totalExpenses;

  return (
    <AppShell title="Transactions">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Total income</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{fmtCurrency(totalIncome)}</p>
            <p className="mt-2 text-xs text-emerald-600">+{transactions.filter((item) => item.type === "income").length} entries</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Total expenses</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{fmtCurrency(totalExpenses)}</p>
            <p className="mt-2 text-xs text-rose-600">-{transactions.filter((item) => item.type === "expense").length} entries</p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Net flow</p>
            <p className={`mt-3 text-3xl font-semibold ${netFlow >= 0 ? "text-emerald-600" : "text-slate-900"}`}>
              {fmtCurrency(netFlow)}
            </p>
            <p className="mt-2 text-xs text-slate-400">Updated monthly</p>
          </Card>
        </section>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Finance activity</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Transaction ledger</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full sm:w-64">
                <Input
                  aria-label="Search transactions"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, category, note"
                />
              </div>
              <Button onClick={openCreateModal}>+ New transaction</Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span>Category</span>
              <select
                aria-label="Filter by category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
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
              <span>From date</span>
              <Input
                aria-label="Filter from date"
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setPage(1);
                }}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span>To date</span>
              <Input
                aria-label="Filter to date"
                type="date"
                value={dateTo}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span>Sort by</span>
              <select
                aria-label="Sort transactions"
                value={`${sortField}-${sortDirection}`}
                onChange={(event) => {
                  const [field, direction] = event.target.value.split("-") as ["date" | "amount", "asc" | "desc"];
                  setSortField(field);
                  setSortDirection(direction);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="date-desc">Date (newest)</option>
                <option value="date-asc">Date (oldest)</option>
                <option value="amount-desc">Amount (high to low)</option>
                <option value="amount-asc">Amount (low to high)</option>
              </select>
            </label>
          </div>

          {error ? (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => {
                  setRetryKey((value) => value + 1);
                  setLoading(true);
                  setError(null);
                }}
                className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
              >
                Retry
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 space-y-3" aria-busy="true" aria-live="polite">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded-full bg-slate-200" />
                      <div className="h-3 w-48 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-16 rounded-xl bg-slate-200" />
                      <div className="h-8 w-8 rounded-xl bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !pageItems.length ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg font-medium text-slate-700">No transactions match your filters</p>
              <p className="mt-2 text-sm text-slate-500">Try changing the filters or add a new transaction.</p>
              <div className="mt-5 flex justify-center">
                <Button onClick={openCreateModal}>Add transaction</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {pageItems.map((item) => (
                        <tr key={item.id} className="align-middle hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-slate-900">{item.title}</p>
                              <p className="text-sm text-slate-500">{item.note || "No note"}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">{item.category}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                item.type === "income"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className={`px-4 py-4 text-sm font-semibold ${item.type === "income" ? "text-emerald-600" : "text-slate-900"}`}>
                            {item.type === "income" ? "+" : "-"}
                            {fmtCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">{fmtDate(item.date)}</td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Transaction</p>
                <h3 id="transaction-modal-title" className="text-xl font-semibold text-slate-900">
                  {editingId ? "Edit transaction" : "Create transaction"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                aria-label="Close transaction form"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                <span>Title</span>
                <Input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="e.g. Grocery run"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Category</span>
                <select
                  value={draft.category}
                  onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  {categoryOptions
                    .filter((option) => option !== "All")
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Type</span>
                <select
                  value={draft.type}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, type: event.target.value as TransactionType }))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Amount</span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={draft.amount}
                  onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
                  placeholder="0.00"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Date</span>
                <Input
                  type="date"
                  value={draft.date}
                  onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                <span>Note</span>
                <textarea
                  rows={3}
                  value={draft.note}
                  onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Optional notes"
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
              <Button onClick={handleSubmit}>{editingId ? "Save changes" : "Create transaction"}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
