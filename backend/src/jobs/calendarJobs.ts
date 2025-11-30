import Account from "@/models/account.model";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import cron from "node-cron";

export const startDailyExpenseJob = () => {
  cron.schedule(
    "0 0 * * *", // runs exactly at 12:00 AM (Asia/Manila)
    async () => {
      const timeZone = "Asia/Manila";
      const now = new Date();
      const phTime = toZonedTime(now, timeZone);

      console.log(
        `🕛 [${formatInTimeZone(
          phTime,
          timeZone,
          "yyyy-MM-dd HH:mm:ss"
        )}] Running daily expense computation job...`
      );

      try {
        // Use yesterday's PH date for computation
        const yesterdayPH = subDays(phTime, 1);
        const yesterdayStartPH = startOfDay(yesterdayPH);
        const yesterdayEndPH = endOfDay(yesterdayPH);

        // Convert PH-local range to UTC
        const startUTC = new Date(yesterdayStartPH.toISOString());
        const endUTC = new Date(yesterdayEndPH.toISOString());

        const yesterdayPhDateString = formatInTimeZone(
          yesterdayPH,
          timeZone,
          "yyyy-MM-dd"
        );

        const users = await Account.find();

        console.log("🎯 Daily expense computation completed successfully.");
      } catch (error) {
        console.error("💥 Fatal error in daily expense job:", error);
      }
    },
    {
      timezone: "Asia/Manila",
    }
  );
};
