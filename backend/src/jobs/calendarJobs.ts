import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Expense from "@/models/expense.model";
import { endOfDay, format, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import mongoose from "mongoose";
import cron from "node-cron";

export const startDailyExpenseJob = () => {
  cron.schedule(
    "0 0 * * *", // Every midnight
    async () => {
      const timeZone = "Asia/Manila";
      const now = new Date();
      const phTime = toZonedTime(now, timeZone);

      console.log(
        `🕛 [${format(
          phTime,
          "yyyy-MM-dd HH:mm:ss"
        )}] Running daily expense computation job...`
      );

      try {
        const startOfDayPH = startOfDay(phTime);
        const endOfDayPH = endOfDay(phTime);

        const users = await Account.find();

        for (const user of users) {
          try {
            const totalExpense = await Expense.aggregate([
              {
                $match: {
                  userId: new mongoose.Types.ObjectId(user._id),
                  createdAt: { $gte: startOfDayPH, $lte: endOfDayPH },
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

            const expenseAmount = totalExpense.length
              ? totalExpense[0].total
              : 0;

            // Prevent duplicates for same day
            const existing = await Calendar.findOne({
              userId: user._id,
              date: { $gte: startOfDayPH, $lte: endOfDayPH },
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
              date: phTime,
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
      timezone: "Asia/Manila", // ensures cron runs on Philippine time
    }
  );

  console.log("✅ Daily Expense Job scheduled (timezone: Asia/Manila)");
};
