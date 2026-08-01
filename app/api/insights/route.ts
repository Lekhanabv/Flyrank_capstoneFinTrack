type TransactionType = "income" | "expense";

type SpendingPattern = {
  category: string;
  amount: number;
};

type RecentTransaction = {
  title?: string;
  category?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
};

type FinancialInput = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  budgetProgress?: number;
  spendingPatterns?: SpendingPattern[];
  recentTransactions?: RecentTransaction[];
  period?: string;
};

const DEFAULT_FINANCIAL_PAYLOAD: FinancialInput = {
  balance: 12680,
  income: 8450,
  expenses: 3420,
  savings: 2680,
  budgetProgress: 72,
  spendingPatterns: [
    { category: "Housing", amount: 1280 },
    { category: "Food", amount: 620 },
    { category: "Transport", amount: 320 },
    { category: "Utilities", amount: 240 },
    { category: "Entertainment", amount: 410 },
    { category: "Shopping", amount: 340 },
  ],
  recentTransactions: [
    { title: "Salary Deposit", category: "Income", amount: 4200, type: "income", date: "2026-07-29" },
    { title: "Rent", category: "Housing", amount: 1280, type: "expense", date: "2026-07-28" },
    { title: "Groceries", category: "Food", amount: 220, type: "expense", date: "2026-07-26" },
    { title: "Streaming Bundle", category: "Entertainment", amount: 58, type: "expense", date: "2026-07-22" },
  ],
  period: "last 30 days",
};

const OPENROUTER_MODEL = "google/gemma-3-27b-it";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

type InsightResponse = {
  overallScore: number;
  summary: string;
  budgetingAdvice: string[];
  spendingSummary: string[];
  savingsRecommendations: string[];
  unusualExpenses: string[];
  financialTips: string[];
  nextSteps: string[];
};

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizePayload(payload: Partial<FinancialInput>): FinancialInput {
  const income = Number(payload.income ?? DEFAULT_FINANCIAL_PAYLOAD.income) || DEFAULT_FINANCIAL_PAYLOAD.income;
  const expenses = Number(payload.expenses ?? DEFAULT_FINANCIAL_PAYLOAD.expenses) || DEFAULT_FINANCIAL_PAYLOAD.expenses;
  const savings = Number(payload.savings ?? DEFAULT_FINANCIAL_PAYLOAD.savings) || DEFAULT_FINANCIAL_PAYLOAD.savings;
  const balance = Number(payload.balance ?? DEFAULT_FINANCIAL_PAYLOAD.balance) || DEFAULT_FINANCIAL_PAYLOAD.balance;
  const budgetProgress = Number(payload.budgetProgress ?? DEFAULT_FINANCIAL_PAYLOAD.budgetProgress) || DEFAULT_FINANCIAL_PAYLOAD.budgetProgress;
  const spendingPatterns = Array.isArray(payload.spendingPatterns) && payload.spendingPatterns.length > 0
    ? payload.spendingPatterns.map((item) => ({
        category: String(item.category ?? "Other"),
        amount: Number(item.amount ?? 0),
      }))
    : DEFAULT_FINANCIAL_PAYLOAD.spendingPatterns;

  const recentTransactions: RecentTransaction[] = Array.isArray(payload.recentTransactions) && payload.recentTransactions.length > 0
    ? payload.recentTransactions.map((item) => {
        const transactionType: TransactionType = item.type === "income" ? "income" : "expense";

        return {
          title: String(item.title ?? "Transaction"),
          category: String(item.category ?? "General"),
          amount: Number(item.amount ?? 0),
          type: transactionType,
          date: String(item.date ?? ""),
        };
      })
    : DEFAULT_FINANCIAL_PAYLOAD.recentTransactions ?? [];

  return {
    balance,
    income,
    expenses,
    savings,
    budgetProgress,
    spendingPatterns,
    recentTransactions,
    period: payload.period ?? DEFAULT_FINANCIAL_PAYLOAD.period,
  };
}

function extractJsonFromText(content: string) {
  const trimmed = content.trim();
  const withoutCodeFence = trimmed.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
  const firstBrace = withoutCodeFence.indexOf("{");
  const lastBrace = withoutCodeFence.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return withoutCodeFence.slice(firstBrace, lastBrace + 1);
  }

  return withoutCodeFence;
}

function ensureInsightStructure(data: Partial<InsightResponse>): InsightResponse {
  return {
    overallScore: clampScore(Number(data.overallScore ?? 82)),
    summary: String(data.summary ?? "Your current financial profile is stable and improving."),
    budgetingAdvice: Array.isArray(data.budgetingAdvice) && data.budgetingAdvice.length > 0
      ? data.budgetingAdvice.map((item) => String(item))
      : ["Keep fixed expenses under 55% of income and continue reducing ad hoc spending."],
    spendingSummary: Array.isArray(data.spendingSummary) && data.spendingSummary.length > 0
      ? data.spendingSummary.map((item) => String(item))
      : ["Essential spending is tracking in line with your plan."],
    savingsRecommendations: Array.isArray(data.savingsRecommendations) && data.savingsRecommendations.length > 0
      ? data.savingsRecommendations.map((item) => String(item))
      : ["Automate a monthly transfer of 10-15% of income into high-yield savings."],
    unusualExpenses: Array.isArray(data.unusualExpenses) && data.unusualExpenses.length > 0
      ? data.unusualExpenses.map((item) => String(item))
      : ["No material anomalies detected in the current spending snapshot."],
    financialTips: Array.isArray(data.financialTips) && data.financialTips.length > 0
      ? data.financialTips.map((item) => String(item))
      : ["Review subscriptions and impulse purchases every week to preserve cash flow."],
    nextSteps: Array.isArray(data.nextSteps) && data.nextSteps.length > 0
      ? data.nextSteps.map((item) => String(item))
      : ["Revisit your budget at month-end and increase automated savings if cash flow remains solid."],
  };
}

function buildFallbackInsights(input: FinancialInput): InsightResponse {
  const monthlyIncome = input.income;
  const monthlyExpenses = input.expenses;
  const monthlySavings = input.savings;
  const spendingPatterns = input.spendingPatterns ?? DEFAULT_FINANCIAL_PAYLOAD.spendingPatterns ?? [];
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
  const topCategory = [...spendingPatterns].sort((a, b) => b.amount - a.amount)[0];

  let overallScore = 82;
  if (savingsRate < 10) overallScore -= 10;
  if (expenseRatio > 45) overallScore -= 8;
  if (topCategory && topCategory.amount > monthlyIncome * 0.22) overallScore -= 5;
  if (savingsRate >= 20) overallScore += 7;

  const budgetingAdvice = [
    `Your spending remains at ${expenseRatio.toFixed(1)}% of income, which is healthy, but consider keeping essential costs below 55% of monthly income.`,
    `If you want more flexibility, create a buffer category equal to 10% of income for irregular charges and annual bills.`,
  ];

  const spendingSummary = [
    `Your monthly spending is ${currency(monthlyExpenses)} against an income of ${currency(monthlyIncome)}.`,
    `${topCategory ? `${topCategory.category} is the largest cost center at ${currency(topCategory.amount)}.` : "No category stands out as a major cost center."}`,
    `The current cash-flow pattern suggests you are keeping non-essential spending under control.`,
  ];

  const savingsRecommendations = [
    `Maintain a minimum savings rate of 15% by sending ${currency(monthlyIncome * 0.15)} directly to savings every month.`,
    `Prioritize a high-yield account or emergency reserve to cover 3-6 months of essential costs.`,
    `Consider directing any surplus cash toward debt paydown or a dedicated goal fund for short-term milestones.`,
  ];

  const unusualExpenses = [
    `No severe spikes were identified in the current snapshot, but check for recurring subscriptions or one-off purchases above ${currency(monthlyIncome * 0.08)}.`,
    `Review the entertainment and shopping categories for any drift beyond your typical baseline.`,
  ];

  const financialTips = [
    "Set a weekly budget check-in to catch spending drift before it becomes a monthly problem.",
    "Use auto-categorization and alerts when a category exceeds its planned threshold by 15%.",
    "Keep a separate sinking-fund allocation for car maintenance, travel, and annual fees.",
  ];

  const nextSteps = [
    "Increase emergency fund contributions by 2-3% if your income remains stable for the next two months.",
    "Review one recurring expense each week and cut or renegotiate anything that no longer adds value.",
    "Reassess your budget after the next pay cycle to confirm you are preserving the right safety buffer.",
  ];

  return {
    overallScore: clampScore(overallScore),
    summary: `Your current profile looks healthy, with a ${savingsRate.toFixed(1)}% savings rate and a stable spending mix in ${input.period}.`,
    budgetingAdvice,
    spendingSummary,
    savingsRecommendations,
    unusualExpenses,
    financialTips,
    nextSteps,
  };
}

function buildEmptyDataMessage() {
  return {
    insights: null,
    message: "Add your financial snapshot to unlock personalized AI insights.",
  };
}

function getOpenRouterApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  console.info("[OpenRouter] API key loaded:", Boolean(apiKey));

  if (!apiKey) {
    throw new Error("OpenRouter API key is not configured on the server.");
  }

  return apiKey;
}

function toFriendlyOpenRouterError(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
  const normalized = rawMessage.toLowerCase();

  console.error("[OpenRouter] API error:", rawMessage);

  if (
    normalized.includes("resource_exhausted") ||
    normalized.includes("quota") ||
    normalized.includes("429") ||
    normalized.includes("exceeded") ||
    normalized.includes("rate limit")
  ) {
    return "OpenRouter API quota exceeded. Please try again in a moment.";
  }

  if (normalized.includes("api key") || normalized.includes("not configured") || normalized.includes("unauthorized")) {
    return "OpenRouter API is not configured. Please add OPENROUTER_API_KEY to the server environment.";
  }

  return "OpenRouter AI is temporarily unavailable. Please try again in a moment.";
}

function extractContentFromOpenRouter(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "{}";
  }

  const body = data as Record<string, unknown>;
  const choices = Array.isArray(body.choices) ? body.choices : [];
  const firstChoice = choices[0] as Record<string, unknown> | undefined;
  const message = firstChoice?.message as Record<string, unknown> | undefined;
  const content = message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object") {
          const item = part as Record<string, unknown>;
          if (typeof item.text === "string") {
            return item.text;
          }
        }

        return "";
      })
      .join("\n");

    return text || "{}";
  }

  return "{}";
}

async function callOpenRouter(input: FinancialInput): Promise<InsightResponse> {
  const apiKey = getOpenRouterApiKey();

  const prompt = `
    You are a senior personal finance analyst.
    Analyze this financial data and return ONLY valid JSON with these keys:
    overallScore, summary, budgetingAdvice, spendingSummary, savingsRecommendations, unusualExpenses, financialTips, nextSteps.

    The JSON values must be arrays of strings for all list fields, and a single number for overallScore.
    Use a practical, supportive tone and focus on spending, budgets, savings, unusual expenses, and clear next steps.

    Financial data:
    ${JSON.stringify({
      balance: input.balance,
      income: input.income,
      expenses: input.expenses,
      savings: input.savings,
      budgetProgress: input.budgetProgress,
      spendingPatterns: input.spendingPatterns,
      recentTransactions: input.recentTransactions,
      period: input.period,
    }, null, 2)}
  `;

  console.info("[OpenRouter] Sending request", {
    model: OPENROUTER_MODEL,
    request: {
      income: input.income,
      expenses: input.expenses,
      savings: input.savings,
      balance: input.balance,
      period: input.period,
    },
  });

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost",
        "X-Title": "FinTrack AI",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      const errorText = responseBody && typeof responseBody === "object"
        ? JSON.stringify(responseBody)
        : `OpenRouter request failed with status ${response.status}`;
      throw new Error(errorText);
    }

    const rawText = extractContentFromOpenRouter(responseBody) || "{}";

    console.info("[OpenRouter] Received response", {
      model: OPENROUTER_MODEL,
      responseLength: rawText.length,
    });

    const parsed = JSON.parse(extractJsonFromText(rawText));
    return ensureInsightStructure(parsed);
  } catch (error) {
    throw new Error(toFriendlyOpenRouterError(error));
  }
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => DEFAULT_FINANCIAL_PAYLOAD);
    const input = normalizePayload(body as Partial<FinancialInput>);

    const hasFinancialData =
      Number.isFinite(input.income) && Number.isFinite(input.expenses) &&
      (input.income > 0 || input.expenses > 0 || input.savings > 0 || input.balance > 0 ||
        (Array.isArray(input.spendingPatterns) && input.spendingPatterns.length > 0) ||
        (Array.isArray(input.recentTransactions) && input.recentTransactions.length > 0));

    if (!hasFinancialData) {
      return Response.json(buildEmptyDataMessage(), { status: 200 });
    }

    const insights = await callOpenRouter(input);
    return Response.json({ insights }, { status: 200 });
  } catch (error) {
    const message = toFriendlyOpenRouterError(error);
    console.error("[OpenRouter] Route failure:", message);

    return Response.json(
      {
        error: message,
        insights: ensureInsightStructure(buildFallbackInsights(normalizePayload(DEFAULT_FINANCIAL_PAYLOAD))),
      },
      { status: 500 },
    );
  }
}
