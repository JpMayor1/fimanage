import type { CalendarType } from "../calendar/calendar.type";

export type DashboardStoreType = {
  dailyExpense: CalendarType[];

  getLoading: boolean;
  updateLoading: boolean;

  getDashboardData: () => Promise<void>;
};
