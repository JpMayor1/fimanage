import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type CalendarType = {
  _id: string;
  userId: string;
  limit: number;
  expense: number;
  createdAt: string;
  updatedAt: string;
};

const CalendarProgress: React.FC = () => {
  const { dailyExpense } = useDashboardStore();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { startDayIndex, daysArray } = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDayIndex = (startOfMonth.day() + 6) % 7;
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { startDayIndex, daysArray };
  }, [currentMonth]);

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));

  const today = dayjs();

  const getProgressForDay = (date: Dayjs) => {
    const record = dailyExpense.find((item: CalendarType) =>
      dayjs(item.createdAt).isSame(date, "day")
    );
    if (!record) return 0;
    const percent = (record.expense / record.limit) * 100;
    return Math.min(100, Math.max(0, percent));
  };

  return (
    <div className="bg-primary text-white rounded-2xl p-5 w-full mx-auto shadow-lg select-none">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daily Expense</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md bg-green/40 hover:bg-green/50 transition-colors cursor-pointer"
          >
            <FaChevronLeft className="text-primary" />
          </button>
          <span className="text-lg font-semibold min-w-[130px] text-center">
            {currentMonth.format("MMMM YYYY")}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md bg-green/40 hover:bg-green/50 transition-colors cursor-pointer"
          >
            <FaChevronRight className="text-primary" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-gray-400 mb-3">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center gap-y-3">
        {/* Empty cells before first day */}
        {Array.from({ length: startDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}

        {/* Actual days */}
        {daysArray.map((day) => {
          const date = currentMonth.date(day);
          const isToday =
            date.isSame(today, "day") &&
            date.isSame(today, "month") &&
            date.isSame(today, "year");

          const progress = getProgressForDay(date);
          const strokeDasharray = 113; // circumference for 18px radius circle
          const strokeDashoffset =
            strokeDasharray - (strokeDasharray * progress) / 100;

          return (
            <div key={day} className="relative flex justify-center">
              {/* Circular progress bar */}
              <svg
                className="absolute w-9 h-9 rotate-[-90deg]"
                viewBox="0 0 40 40"
                preserveAspectRatio="xMidYMid meet"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  className="stroke-gray-700"
                  fill="none"
                  strokeWidth="2"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  className={`${
                    progress >= 100
                      ? "stroke-red-500"
                      : progress >= 75
                      ? "stroke-orange-500"
                      : "stroke-green-500"
                  }`}
                  fill="none"
                  strokeWidth="2.5"
                  strokeDasharray={113}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Day number */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium z-10 ${
                  isToday
                    ? "bg-orange-500 text-white"
                    : "bg-transparent text-gray-300"
                }`}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarProgress;
