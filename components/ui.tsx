import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const baseButtonClasses =
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 disabled:cursor-not-allowed disabled:opacity-60 hover:-translate-y-0.5";

const buttonVariantClasses = {
  primary: "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] hover:bg-slate-800 hover:shadow-[0_14px_28px_rgba(15,23,42,0.14)]",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md",
  ghost: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  danger: "bg-rose-600 text-white shadow-[0_10px_24px_rgba(225,29,72,0.22)] hover:bg-rose-500 hover:shadow-[0_14px_26px_rgba(225,29,72,0.28)]",
};

const buttonSizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariantClasses;
  size?: keyof typeof buttonSizeClasses;
}) {
  return (
    <button
      type={type}
      className={`${baseButtonClasses} ${buttonVariantClasses[variant]} ${buttonSizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  tone = "bg-blue-50 text-blue-700",
}: {
  label: string;
  value: string;
  trend: string;
  tone?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{label}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}>{trend}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </Card>
  );
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${className}`}
      {...props}
    />
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  className = "",
  label = "Search",
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <circle cx="11" cy="11" r="5.5" />
        <path d="M16 16l4 4" />
      </svg>
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-6 flex items-center justify-between gap-3 ${className}`}>
      <div>
        {eyebrow ? <p className="text-sm text-slate-500">{eyebrow}</p> : null}
        <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
