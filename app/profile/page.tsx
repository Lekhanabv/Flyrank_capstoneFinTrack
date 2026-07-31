import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <Card className="p-6 sm:p-8">
        <p className="text-sm text-slate-500">Placeholder</p>
        <h2 className="mt-3 text-2xl font-semibold">User profile settings</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          This page will contain personal account info, preferences, and identity details.
        </p>
      </Card>
    </AppShell>
  );
}
