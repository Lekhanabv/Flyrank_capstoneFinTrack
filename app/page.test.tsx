import { render, screen } from '@testing-library/react';
import Home from './page';

jest.mock('@/components/financial-insights', () => ({
  FinancialInsights: () => <div>AI Financial Insights</div>,
}));

describe('Dashboard page', () => {
  it('renders the dashboard heading and AI insights section', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/ai financial insights/i)).toBeInTheDocument();
  });
});
