import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Expense from "@/models/expense.model";
import { endOfDay, startOfDay } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import mongoose from "mongoose";
import cron from "node-cron";

export const startDailyExpenseJob = () => {
  cron.schedule(
    "59 23 * * *",
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
        // Use today's PH date
        const todayStartPH = startOfDay(phTime);
        const todayEndPH = endOfDay(phTime);

        // Convert PH-local range to UTC equivalents
        const startUTC = new Date(todayStartPH.toISOString());
        const endUTC = new Date(todayEndPH.toISOString());

        const users = await Account.find();

        for (const user of users) {
          try {
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
              date: { $gte: startUTC, $lte: endUTC },
            });

            if (existing) {
              console.log(
                `ℹ️ Already recorded for ${user.username}, skipping...`
              );
              continue;
            }

            await Calendar.create({
              userId: user._id,
              limit: user.limit || 500,
              expense: expenseAmount,
              date: todayStartPH,
            });

            console.log(
              `✅ Recorded ₱${expenseAmount.toFixed(2)} for ${user.username}`
            );
          } catch (userError) {
            console.error(`⚠️ Error processing ${user.username}:`, userError);
          }
        }

        console.log("🏁 Daily expense computation completed successfully.");
      } catch (error) {
        console.error("❌ Fatal error in daily expense job:", error);
      }
    },
    {
      timezone: "Asia/Manila",
    }
  );

  console.log("✅ Daily Expense Job scheduled (timezone: Asia/Manila)");
};
