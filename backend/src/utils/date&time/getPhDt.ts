import { formatInTimeZone } from "date-fns-tz";

export const getPhDt = (): string => {
  const timezone = "Asia/Manila";
  const formattedDateTime = formatInTimeZone(
    new Date(),
    timezone,
    "MMMM d, yyyy, h:mm a",
    {
      timeZone: timezone,
    }
  );

  return formattedDateTime;
};

export function formatDate(dateInput: string | number | Date): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
