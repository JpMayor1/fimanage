import type { TutorialStep } from "@/types/onboarding/onboarding.type";

export const dashboardSteps: TutorialStep[] = [
  {
    id: "dashboard-welcome",
    target: "[data-tour='dashboard-header']",
    title: "Welcome to Dashboard!",
    content:
      "This is your financial dashboard where you can see an overview of all your financial activities, including income, expenses, and balances.",
    position: "bottom",
    page: "dashboard",
  },
  {
    id: "dashboard-summary",
    target: "[data-tour='summary-cards']",
    title: "Summary Cards",
    content:
      "These cards show your total income, expense, balance, and today's expense. Keep an eye on these to track your financial health.",
    position: "bottom",
    page: "dashboard",
  },
  {
    id: "dashboard-calendar",
    target: "[data-tour='calendar-progress']",
    title: "Daily Expense Calendar",
    content:
      "Track your daily expenses throughout the month. Each day shows your spending compared to your daily limit.",
    position: "bottom",
    page: "dashboard",
  },
  {
    id: "dashboard-charts",
    target: "[data-tour='transaction-types']",
    title: "Transaction Types",
    content:
      "This chart shows the distribution of your transaction types. See how your income, expenses, transfers, and payments are distributed.",
    position: "left",
    page: "dashboard",
  },
  {
    id: "dashboard-top-sources",
    target: "[data-tour='top-sources']",
    title: "Top Sources",
    content:
      "Your top 5 money sources ranked by balance. Click on any source to view detailed information and transactions.",
    position: "right",
    page: "dashboard",
  },
  {
    id: "dashboard-recent",
    target: "[data-tour='recent-transactions']",
    title: "Recent Transactions",
    content:
      "View your 6 most recent transactions. Navigate to the Transactions page to see all your financial activities.",
    position: "top",
    page: "dashboard",
  },
];

export const sourcesSteps: TutorialStep[] = [
  {
    id: "sources-header",
    target: "[data-tour='sources-header']",
    title: "Sources Management",
    content:
      "Manage all your money sources here. A source can be a bank account, wallet, cash, or any place where you store money.",
    position: "bottom",
    page: "sources",
  },
  {
    id: "sources-add",
    target: "[data-tour='sources-add']",
    title: "Add Source",
    content:
      "Click this button to add a new money source. You'll need to provide a name for the source.",
    position: "bottom",
    page: "sources",
  },
  {
    id: "sources-list",
    target: "[data-tour='sources-list']",
    title: "Your Sources",
    content:
      "Click on any source card to view full details including all transactions. Use Edit and Delete buttons to manage your sources.",
    position: "top",
    page: "sources",
  },
];

export const deptsSteps: TutorialStep[] = [
  {
    id: "depts-header",
    target: "[data-tour='depts-header']",
    title: "Depts Management",
    content:
      "Track what you owe to others. Add depts with lender name, amount, due date, and optional interest rate.",
    position: "bottom",
    page: "depts",
  },
  {
    id: "depts-add",
    target: "[data-tour='depts-add']",
    title: "Add Dept",
    content:
      "Click here to add a new dept. You can set the amount, remaining balance, due date, interest rate, and notes.",
    position: "bottom",
    page: "depts",
  },
  {
    id: "depts-status",
    target: "[data-tour='depts-list']",
    title: "Dept Status",
    content:
      "Each dept shows its status: pending, paid, or overdue. The status updates automatically based on due dates and remaining amounts.",
    position: "top",
    page: "depts",
  },
];

export const receivingsSteps: TutorialStep[] = [
  {
    id: "receivings-header",
    target: "[data-tour='receivings-header']",
    title: "Receivings Management",
    content:
      "Track money that others owe you. Similar to depts, but for money you're expecting to receive.",
    position: "bottom",
    page: "receivings",
  },
  {
    id: "receivings-add",
    target: "[data-tour='receivings-add']",
    title: "Add Receiving",
    content:
      "Add a new receiving entry when someone owes you money. Track the borrower, amount, due date, and interest if applicable.",
    position: "bottom",
    page: "receivings",
  },
  {
    id: "receivings-list",
    target: "[data-tour='receivings-list']",
    title: "Your Receivings",
    content:
      "View all money owed to you. Click on any receiving to see full details and payment history.",
    position: "top",
    page: "receivings",
  },
];

export const transactionsSteps: TutorialStep[] = [
  {
    id: "transactions-header",
    target: "[data-tour='transactions-header']",
    title: "Transactions",
    content:
      "View and manage all your financial transactions. Filter by type or view all transactions together.",
    position: "bottom",
    page: "transactions",
  },
  {
    id: "transactions-filter",
    target: "[data-tour='transactions-filter']",
    title: "Filter Transactions",
    content:
      "Use this dropdown to filter transactions by type: Income, Expense, Transfer, Dept Payment, or Receiving Payment.",
    position: "bottom",
    page: "transactions",
  },
  {
    id: "transactions-add",
    target: "[data-tour='transactions-add']",
    title: "Add Transaction",
    content:
      "Record new financial activities. Choose the transaction type and fill in the required details. The system will automatically update related sources, depts, or receivings.",
    position: "bottom",
    page: "transactions",
  },
  {
    id: "transactions-list",
    target: "[data-tour='transactions-list']",
    title: "Transaction List",
    content:
      "All your transactions are listed here with type badges, notes, dates, and amounts. Click Edit or Delete to manage them.",
    position: "top",
    page: "transactions",
  },
];

export const reportsSteps: TutorialStep[] = [
  {
    id: "reports-header",
    target: "[data-tour='reports-header']",
    title: "Financial Reports",
    content:
      "Generate comprehensive financial reports for any period. View detailed analytics and export to PDF.",
    position: "bottom",
    page: "reports",
  },
  {
    id: "reports-period",
    target: "[data-tour='reports-period']",
    title: "Select Period",
    content:
      "Choose the time period for your report: Last Week, Last Month, or Last Year. The report will show all financial data for that period.",
    position: "bottom",
    page: "reports",
  },
  {
    id: "reports-download",
    target: "[data-tour='reports-download']",
    title: "Download PDF",
    content:
      "Export your financial report as a professional PDF document. Perfect for sharing or keeping records.",
    position: "bottom",
    page: "reports",
  },
  {
    id: "reports-content",
    target: "[data-tour='reports-content']",
    title: "Report Details",
    content:
      "View comprehensive statistics including summaries, transaction breakdowns, overdue items, top sources, and daily expense summaries.",
    position: "top",
    page: "reports",
  },
];

export const profileSteps: TutorialStep[] = [
  {
    id: "profile-header",
    target: "[data-tour='profile-header']",
    title: "Profile Settings",
    content:
      "Manage your account information and preferences. Update your personal details and daily expense limit here.",
    position: "bottom",
    page: "profile",
  },
  {
    id: "profile-daily-limit",
    target: "[data-tour='profile-daily-limit']",
    title: "Daily Expense Limit",
    content:
      "Set your daily spending limit. You'll receive a warning when you approach or exceed this limit when adding expense transactions.",
    position: "bottom",
    page: "profile",
  },
];
