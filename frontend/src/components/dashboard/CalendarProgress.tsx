import { useDashboardStore } from "@/stores/dashboard/useDashboardStore";
import type { CalendarType } from "@/types/calendar/calendar.type";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CalendarProgress: React.FC = () => {
  const { dailyExpense } = useDashboardStore();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [fade, setFade] = useState<"in" | "out">("in");
  const [animatedProgress, setAnimatedProgress] = useState<
    Record<string, number>
  >({});
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const isMobile = window.innerWidth <= 768;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { startDayIndex, daysArray } = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    const startDayIndex = (startOfMonth.day() + 6) % 7;
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { startDayIndex, daysArray };
  }, [currentMonth]);

  const changeMonth = (direction: "prev" | "next") => {
    setFade("out");
    setTimeout(() => {
      setCurrentMonth((m) =>
        direction === "prev" ? m.subtract(1, "month") : m.add(1, "month")
      );
      setFade("in");
    }, 200);
  };

  const today = dayjs();

  const handleDateAction = (dateKey: string) => {
    if (activeDate === dateKey) {
      setActiveDate(null);
    } else {
      setActiveDate(dateKey);
    }
  };

  useEffect(() => {
    const newProgress: Record<string, number> = {};
    const getProgressForDay = (date: Dayjs) => {
      const record = dailyExpense.find((item: CalendarType) =>
        dayjs(item.date).isSame(date, "day")
      );
      if (!record) return 0;
      const percent = (record.expense / record.limit) * 100;
      return Math.min(100, Math.max(0, percent));
    };

    daysArray.forEach((day) => {
      const date = currentMonth.date(day);
      newProgress[date.format("YYYY-MM-DD")] = getProgressForDay(date);
    });

    const duration = 800;
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const animate = () => {
      frame++;
      const progressFactor = frame / totalFrames;
      const eased =
        progressFactor < 0.5
          ? 4 * progressFactor * progressFactor * progressFactor
          : 1 - Math.pow(-2 * progressFactor + 2, 3) / 2;

      setAnimatedProgress(() => {
        const interpolated: Record<string, number> = {};
        for (const key in newProgress) {
          interpolated[key] = newProgress[key] * eased;
        }
        return interpolated;
      });

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [currentMonth, dailyExpense, daysArray]);

  useEffect(() => {
    const closePopover = () => setActiveDate(null);
    if (activeDate) {
      document.addEventListener("click", closePopover);
    }
    return () => document.removeEventListener("click", closePopover);
  }, [activeDate]);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-sm p-4 md:p-6 shadow-xl select-none overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-base md:text-lg font-semibold">
          Daily Expense
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth("prev")}
            className="p-2 rounded-lg bg-yellow/10 border border-yellow/30 hover:bg-yellow/20 transition-colors cursor-pointer"
          >
            <FaChevronLeft className="text-yellow text-sm" />
          </button>
          <span className="text-white text-sm font-semibold whitespace-nowrap text-center px-2">
            {currentMonth.format("MMMM YYYY")}
          </span>
          <button
            onClick={() => changeMonth("next")}
            className="p-2 rounded-lg bg-yellow/10 border border-yellow/30 hover:bg-yellow/20 transition-colors cursor-pointer"
          >
            <FaChevronRight className="text-yellow text-sm" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-white/60 mb-3">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-semibold text-xs md:text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        className={`grid grid-cols-7 text-center gap-y-3 transition-opacity duration-200 ${
          fade === "in" ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Empty cells before first day */}
        {Array.from({ length: startDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}

        {/* Actual days */}
        {daysArray.map((day) => {
          const date = currentMonth.date(day);
          const dateKey = date.format("YYYY-MM-DD");
          const progress = animatedProgress[dateKey] || 0;

          const record = dailyExpense.find((item: CalendarType) =>
            dayjs(item.date).isSame(date, "day")
          );

          const strokeDasharray = 113;
          const strokeDashoffset =
            strokeDasharray - (strokeDasharray * progress) / 100;

          // Calculate actual percentage for color determination
          const actualPercentage = record
            ? (record.expense / record.limit) * 100
            : 0;

          const isToday =
            date.isSame(today, "day") &&
            date.isSame(today, "month") &&
            date.isSame(today, "year");

          return (
            <div
              key={day}
              className="relative flex justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDateAction(dateKey);
              }}
              onMouseEnter={() => !isMobile && setActiveDate(dateKey)}
              onMouseLeave={() => !isMobile && setActiveDate(null)}
            >
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
                  className="stroke-white/10"
                  fill="none"
                  strokeWidth="2"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  className={`${
                    actualPercentage >= 100
                      ? "stroke-red"
                      : progress >= 75
                      ? "stroke-yellow"
                      : "stroke-green"
                  } transition-none`}
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
                    ? "bg-yellow/20 border-2 border-yellow/60 text-yellow"
                    : "bg-transparent text-white/80"
                }`}
              >
                {day}
              </div>

              {/* Popover showing limit and expense */}
              {activeDate === dateKey && record && (
                <div
                  className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="whitespace-nowrap text-xs">
                    <span className="font-semibold text-white/80">Limit:</span>{" "}
                    <span className="text-yellow">
                      ₱{record.limit.toLocaleString()}
                    </span>
                  </p>
                  <p className="whitespace-nowrap text-xs">
                    <span className="font-semibold text-white/80">
                      Expense:
                    </span>{" "}
                    <span className="text-expense">
                      ₱{record.expense.toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarProgress;
