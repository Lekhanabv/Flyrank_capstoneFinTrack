"use client";

import {
  ArrowLeftRight,
  BarChart3,
  FileBarChart2,
  LayoutDashboard,
  Menu,
  PiggyBank,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui";

export const navItems = [
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

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const className = active ? "text-white" : "text-slate-400";

  switch (name) {
    case "Dashboard":
      return <LayoutDashboard className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Transactions":
      return <ArrowLeftRight className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Budget":
      return <WalletCards className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Analytics":
      return <BarChart3 className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Goals":
      return <Target className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Reports":
      return <FileBarChart2 className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Profile":
      return <UserRound className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Settings":
      return <Settings className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    case "Health Check":
      return <ShieldCheck className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
    default:
      return <PiggyBank className={`h-4 w-4 ${className}`} strokeWidth={1.8} />;
  }
}

export function AppShell({
  title,
  children,
  headerAction,
}: {
  title?: string;
  children: ReactNode;
  headerAction?: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeItem = navItems.find((item) => item.href === pathname)?.name ?? "Dashboard";
  const currentTitle = title ?? activeItem;

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-slate-200 lg:flex">
          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-base font-bold text-white shadow-[0_10px_24px_rgba(59,130,246,0.35)]">
              F
            </div>
            <div>
              <p className="text-lg font-semibold text-white">FinTrack</p>
              <p className="text-xs text-slate-400">Finance OS</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-5">
            {navItems.map((item) => {
              const isActive = activeItem === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-slate-800 text-white shadow-inner shadow-slate-700/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:shadow-[0_8px_18px_rgba(15,23,42,0.18)]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <NavIcon name={item.name} active={isActive} />
                    {item.name}
                  </span>
                  {item.badge ? (
                    <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-200">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <div className="rounded-2xl bg-slate-800/80 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cash runway</p>
              <p className="mt-3 text-2xl font-semibold text-white">21 months</p>
              <p className="mt-1 text-xs text-emerald-300">+3.1 months vs plan</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 ease-out hover:bg-slate-50 hover:shadow-md lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.8} />
                </button>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Overview</p>
                  <h1 className="text-lg font-semibold text-slate-900">{currentTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {headerAction ? <div>{headerAction}</div> : null}
                <Button variant="primary" size="md" className="hidden sm:inline-flex">
                  New report
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        >
          <div
            className="h-full w-72 max-w-[80vw] bg-slate-950 p-4 text-slate-200"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white">
                  F
                </div>
                <div>
                  <p className="font-semibold text-white">FinTrack</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = activeItem === item.name;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ease-out ${
                      isActive ? "bg-slate-800 text-white shadow-inner shadow-slate-700/30" : "text-slate-300 hover:bg-slate-800/80 hover:text-white hover:shadow-[0_8px_18px_rgba(15,23,42,0.18)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <NavIcon name={item.name} active={isActive} />
                      {item.name}
                    </span>
                    {item.badge ? (
                      <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-200">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </main>
  );
}
