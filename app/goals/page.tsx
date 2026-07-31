import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function GoalsPage() {
  return (
    <AppShell title="Goals">
      <Card className="p-6 sm:p-8">
        <p className="text-sm text-slate-500">Placeholder</p>
        <h2 className="mt-3 text-2xl font-semibold">Goal tracking center</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          This page will track milestones, progress bars, and savings or growth targets.
        </p>
      </Card>
    </AppShell>
  );
}
