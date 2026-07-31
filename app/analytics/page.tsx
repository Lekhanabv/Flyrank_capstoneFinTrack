import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics">
      <Card className="p-6 sm:p-8">
        <p className="text-sm text-slate-500">Placeholder</p>
        <h2 className="mt-3 text-2xl font-semibold">Performance analytics</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          This section will surface trends, forecasting visualizations, and KPI analysis.
        </p>
      </Card>
    </AppShell>
  );
}
