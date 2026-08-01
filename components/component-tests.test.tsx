import { render, screen, waitFor } from '@testing-library/react';
import { AppShell } from './app-shell';
import { FinancialInsights } from './financial-insights';
import { Button, SearchBar, SectionHeader } from './ui';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Component render coverage', () => {
  it('renders the app shell navigation and header', () => {
    render(
      <AppShell title="Dashboard">
        <div>Dashboard content</div>
      </AppShell>
    );

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/finance os/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new report/i })).toBeInTheDocument();
  });

  it('renders the shared button and section header UI', () => {
    render(
      <>
        <Button>Save report</Button>
        <SectionHeader eyebrow="Overview" title="Budget health" />
      </>
    );

    expect(screen.getByRole('button', { name: /save report/i })).toBeInTheDocument();
    expect(screen.getByText(/overview/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /budget health/i })).toBeInTheDocument();
  });

  it('renders the search bar with its accessible label', () => {
    render(
      <SearchBar
        label="Search transactions"
        placeholder="Search transactions"
        value="rent"
        onChange={() => undefined}
      />
    );

    const input = screen.getByLabelText(/search transactions/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('rent');
  });

  it('renders the AI insights panel shell and core headings', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        insights: {
          overallScore: 88,
          summary: 'Your monthly cash flow is strong and improving.',
          budgetingAdvice: ['Keep fixed costs below 55% of income.'],
          spendingSummary: ['Housing remains your largest cost center.'],
          savingsRecommendations: ['Automate savings of 15% of income.'],
          unusualExpenses: ['No major anomalies detected.'],
          financialTips: ['Review subscriptions weekly.'],
          nextSteps: ['Increase emergency reserve by 2%.'],
        },
      }),
    }) as jest.Mock;

    render(<FinancialInsights />);

    await waitFor(() => {
      expect(screen.getByText(/ai financial insights/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/personalized money guidance/i)).toBeInTheDocument();
    expect(screen.getByText(/analyzing finances/i)).toBeInTheDocument();
  });
});
