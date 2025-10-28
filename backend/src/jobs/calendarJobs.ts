import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Expense from "@/models/expense.model";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import mongoose from "mongoose";
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

        // Convert PH-local range to UTC equivalents for DB queries
        const startUTC = new Date(yesterdayStartPH.toISOString());
        const endUTC = new Date(yesterdayEndPH.toISOString());

        // For saving record with correct date string
        const yesterdayPhDateString = formatInTimeZone(
          yesterdayPH,
          timeZone,
          "yyyy-MM-dd"
        );

        const users = await Account.find();

        for (const user of users) {
          try {
            // Compute total expenses for *yesterday*
            const totalExpense = await Expense.aggregate([
              {
                $match: {
                  userId: new mongoose.Types.ObjectId(user._id),
                  createdAt: { $gte: startUTC, $lte: endUTC },
                  countable: true,
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ]);

            const expenseAmount =
              totalExpense.length > 0 ? totalExpense[0].total : 0;

            // Prevent duplicate records for the same day
            const existing = await Calendar.findOne({
              userId: user._id,
              date: yesterdayPhDateString,
            });

            if (existing) {
              console.log(
                `ℹAlready recorded for ${user.username} (${yesterdayPhDateString}), skipping...`
              );
              continue;
            }

            await Calendar.create({
              userId: user._id,
              limit: user.limit || 500,
              expense: expenseAmount,
              date: yesterdayPhDateString,
            });

            console.log(
              `Recorded ₱${expenseAmount.toFixed(2)} for ${
                user.username
              } (Date: ${yesterdayPhDateString})`
            );
          } catch (userError) {
            console.error(`⚠️ Error processing ${user.username}:`, userError);
          }
        }

        console.log("Daily expense computation completed successfully.");
      } catch (error) {
        console.error("Fatal error in daily expense job:", error);
      }
    },
    {
      timezone: "Asia/Manila",
    }
  );
};
