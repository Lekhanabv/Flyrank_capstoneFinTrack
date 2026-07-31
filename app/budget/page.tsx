import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function BudgetPage() {
  return (
    <AppShell title="Budget">
      <Card className="p-6 sm:p-8">
        <p className="text-sm text-slate-500">Placeholder</p>
        <h2 className="mt-3 text-2xl font-semibold">Budget planning dashboard</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          This view will include category budgets, variance tracking, and allocation controls.
        </p>
      </Card>
    </AppShell>
  );
}
