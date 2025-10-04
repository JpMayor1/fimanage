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
