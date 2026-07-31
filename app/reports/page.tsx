import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function ReportsPage() {
  return (
    <AppShell title="Reports">
      <Card className="p-6 sm:p-8">
        <p className="text-sm text-slate-500">Placeholder</p>
        <h2 className="mt-3 text-2xl font-semibold">Financial reports</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          This area will include exported summaries, audit logs, and scheduled reporting views.
        </p>
      </Card>
    </AppShell>
  );
}
