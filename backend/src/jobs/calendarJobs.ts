import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Transaction from "@/models/transaction.model";
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

        // Convert PH-local range to UTC for MongoDB query
        const startUTC = new Date(yesterdayStartPH.toISOString());
        const endUTC = new Date(yesterdayEndPH.toISOString());

        const yesterdayPhDateString = formatInTimeZone(
          yesterdayPH,
          timeZone,
          "yyyy-MM-dd"
        );

        // Find all expense transactions created yesterday
        const expenseTransactions = await Transaction.find({
          type: "expense",
          createdAt: {
            $gte: startUTC,
            $lte: endUTC,
          },
        });

        console.log(
          `📊 Found ${expenseTransactions.length} expense transactions for ${yesterdayPhDateString}`
        );

        // Group expenses by userId and calculate total
        const expensesByUser = new Map<string, number>();

        for (const transaction of expenseTransactions) {
          const userId = transaction.userId;
          const amount = transaction.expense?.amount || 0;

          if (expensesByUser.has(userId)) {
            expensesByUser.set(userId, expensesByUser.get(userId)! + amount);
          } else {
            expensesByUser.set(userId, amount);
          }
        }

        // Get all users to ensure we create calendar entries for all
        const users = await Account.find();

        // Create or update calendar entries for each user
        for (const user of users) {
          const userId = user._id.toString();
          const totalExpense = expensesByUser.get(userId) || 0;
          const userLimit = user.limit || 500;

          await Calendar.findOneAndUpdate(
            {
              userId,
              date: yesterdayPhDateString,
            },
            {
              userId,
              limit: userLimit,
              expense: totalExpense,
              date: yesterdayPhDateString,
            },
            {
              upsert: true,
              new: true,
            }
          );

          console.log(
            `✅ User ${userId}: Total expense = ${totalExpense}, Limit = ${userLimit}`
          );
        }

        console.log(
          `🎯 Daily expense computation completed successfully for ${yesterdayPhDateString}.`
        );
      } catch (error) {
        console.error("💥 Fatal error in daily expense job:", error);
      }
    },
    {
      timezone: "Asia/Manila",
    }
  );
};
