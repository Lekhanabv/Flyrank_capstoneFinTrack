"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

const profileInitialState = {
  fullName: "Alicia Ray",
  email: "alicia@fintrack.ai",
  phone: "+1 (415) 320-2919",
  location: "San Francisco, CA",
  role: "Product Manager",
  bio: "Focused on building resilient habits, optimizing savings, and planning long-term financial independence.",
  monthlyIncome: "9200",
  homeCity: "San Francisco",
  riskProfile: "Balanced",
};

export default function ProfilePage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState(profileInitialState);
  const [isSaved, setIsSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof profileInitialState, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
    setFormError(null);
  };

  const handleSave = () => {
    if (!profile.fullName.trim()) {
      setFormError("Full name is required.");
      addToast({ type: "error", title: "Profile not saved", description: "Please add a full name before saving." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setFormError("Please enter a valid email address.");
      addToast({ type: "error", title: "Invalid email", description: "Use a valid email format before saving." });
      return;
    }

    setFormError(null);
    setIsSaved(true);
    addToast({ type: "success", title: "Profile saved", description: "Your account profile has been updated." });
  };

  return (
    <AppShell title="Profile">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-bold text-white shadow-[0_12px_28px_rgba(56,189,248,0.35)]">
              AR
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Profile</p>
              <h2 className="mt-1 text-2xl font-semibold">{profile.fullName}</h2>
              <p className="mt-1 text-sm text-slate-300">{profile.role} • {profile.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-400">Status</span>
              <span className="mt-1 inline-flex items-center gap-2 font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Verified
              </span>
            </div>
            <Button variant="secondary" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Upload photo
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Personal info</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Identity details</h3>
              </div>
              {isSaved ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Saved</span> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Full name</span>
                <Input value={profile.fullName} onChange={(event) => handleChange("fullName", event.target.value)} />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Email address</span>
                <Input value={profile.email} onChange={(event) => handleChange("email", event.target.value)} />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Phone number</span>
                <Input value={profile.phone} onChange={(event) => handleChange("phone", event.target.value)} />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Location</span>
                <Input value={profile.location} onChange={(event) => handleChange("location", event.target.value)} />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Role / title</span>
                <Input value={profile.role} onChange={(event) => handleChange("role", event.target.value)} />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span>Home city</span>
                <Input value={profile.homeCity} onChange={(event) => handleChange("homeCity", event.target.value)} />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                <span>Short bio</span>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(event) => handleChange("bio", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </label>
            </div>

            {formError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {formError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary">Cancel</Button>
              <Button onClick={handleSave}>Save profile</Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Financial profile</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Money goals</h3>

              <div className="mt-5 space-y-4">
                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span>Monthly income</span>
                  <Input value={profile.monthlyIncome} onChange={(event) => handleChange("monthlyIncome", event.target.value)} />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-600">
                  <span>Risk profile</span>
                  <select
                    value={profile.riskProfile}
                    onChange={(event) => handleChange("riskProfile", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Growth">Growth</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </label>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <p className="text-sm text-slate-500">Account status</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Security snapshot</h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <span className="text-sm text-slate-600">Two-factor auth</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Enabled</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <span className="text-sm text-slate-600">Last login</span>
                  <span className="text-sm font-medium text-slate-900">Today, 9:41 AM</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <span className="text-sm text-slate-600">Data sync</span>
                  <span className="text-sm font-medium text-slate-900">Up to date</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
