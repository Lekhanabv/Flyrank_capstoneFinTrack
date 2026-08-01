"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

const notificationDefaults = {
  budgetingAlerts: true,
  transactionAlerts: true,
  weeklyReports: true,
  securityAlerts: true,
  marketUpdates: false,
};

const themeOptions = ["Light", "Dark", "System"] as const;
const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"] as const;
const languageOptions = ["English", "Spanish", "French", "German", "Portuguese"] as const;

export default function SettingsPage() {
  const { addToast } = useToast();
  const [theme, setTheme] = useState<(typeof themeOptions)[number]>("Light");
  const [currency, setCurrency] = useState<(typeof currencyOptions)[number]>("USD");
  const [language, setLanguage] = useState<(typeof languageOptions)[number]>("English");
  const [notifications, setNotifications] = useState(notificationDefaults);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionLock, setSessionLock] = useState("15 minutes");
  const [saveError, setSaveError] = useState<string | null>(null);

  const activePreferenceSummary = useMemo(
    () => `${theme} theme • ${currency} currency • ${language}`,
    [theme, currency, language],
  );

  const toggleNotification = (key: keyof typeof notificationDefaults) => {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
    setSaveError(null);
  };

  const handleSaveSettings = () => {
    if (!currency || !language) {
      setSaveError("Please choose a valid currency and language before saving.");
      addToast({ type: "error", title: "Preferences not saved", description: "Please complete all settings." });
      return;
    }

    setSaveError(null);
    addToast({ type: "success", title: "Settings saved", description: "Your preferences were updated successfully." });
  };

  return (
    <AppShell title="Settings">
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Preferences</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Account settings</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{activePreferenceSummary}</div>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <p className="text-sm text-slate-500">Appearance</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Theme and display</h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {themeOptions.map((option) => {
                const active = theme === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTheme(option)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preview</p>
              <div className={`mt-3 rounded-2xl border p-4 ${theme === "Dark" ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
                <p className="text-sm font-medium">Monthly cash flow</p>
                <p className="mt-2 text-2xl font-semibold">$18,420</p>
                <p className={`mt-1 text-xs ${theme === "Dark" ? "text-slate-300" : "text-slate-500"}`}>
                  +4.8% vs last month
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <p className="text-sm text-slate-500">Regional settings</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Currency and language</h3>

            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Currency</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as (typeof currencyOptions)[number])}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  {currencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Language</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as (typeof languageOptions)[number])}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  {languageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <p className="text-sm text-slate-500">Alerts</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Notifications</h3>

            <div className="mt-5 space-y-3">
              {Object.entries(notifications).map(([key, enabled]) => (
                <label key={key} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-sm text-slate-700">
                    {key === "budgetingAlerts" && "Budgeting alerts"}
                    {key === "transactionAlerts" && "Transaction alerts"}
                    {key === "weeklyReports" && "Weekly financial reports"}
                    {key === "securityAlerts" && "Security alerts"}
                    {key === "marketUpdates" && "Market updates"}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => toggleNotification(key as keyof typeof notificationDefaults)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      enabled ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                        enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <p className="text-sm text-slate-500">Protection</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">Secure account options</h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Two-factor authentication</p>
                  <p className="text-xs text-slate-500">Adds a second verification step</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled((current) => !current)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={twoFactorEnabled}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Session auto-lock</span>
                <select
                  value={sessionLock}
                  onChange={(event) => setSessionLock(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="Immediately">Immediately</option>
                  <option value="5 minutes">5 minutes</option>
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                </select>
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button variant="secondary">Change password</Button>
                <Button variant="secondary">Review devices</Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Account actions</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Data and security controls</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Export data</Button>
              <Button variant="danger">Delete account</Button>
            </div>
          </div>

          {saveError ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {saveError}
            </div>
          ) : null}

          <div className="mt-5 flex justify-end">
            <Button onClick={handleSaveSettings}>Save preferences</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
