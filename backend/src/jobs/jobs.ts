import Account from "@/models/account.model";
import Calendar from "@/models/calendar.model";
import Dept from "@/models/dept.model";
import Receiving from "@/models/receiving.model";
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

export const startOverdueCheckJob = () => {
  cron.schedule(
    "0 1 * * *", // runs at 1:00 AM (Asia/Manila) - after the expense job
    async () => {
      const timeZone = "Asia/Manila";
      const now = new Date();
      const phTime = toZonedTime(now, timeZone);

      console.log(
        `🕛 [${formatInTimeZone(
          phTime,
          timeZone,
          "yyyy-MM-dd HH:mm:ss"
        )}] Running overdue check job...`
      );

      try {
        // Get today's date in PH timezone
        const todayPhDateString = formatInTimeZone(
          phTime,
          timeZone,
          "yyyy-MM-dd"
        );

        // Find all depts that are pending and overdue
        const overdueDepts = await Dept.find({
          status: "pending",
          dueDate: { $exists: true, $ne: "", $lt: todayPhDateString },
        });

        // Update overdue depts
        if (overdueDepts.length > 0) {
          const result = await Dept.updateMany(
            {
              status: "pending",
              dueDate: { $exists: true, $ne: "", $lt: todayPhDateString },
            },
            {
              $set: { status: "overdue" },
            }
          );

          console.log(
            `📋 Updated ${result.modifiedCount} dept(s) to overdue status`
          );
        } else {
          console.log("📋 No overdue depts found");
        }

        // Find all receivings that are pending and overdue
        const overdueReceivings = await Receiving.find({
          status: "pending",
          dueDate: { $exists: true, $ne: "", $lt: todayPhDateString },
        });

        // Update overdue receivings
        if (overdueReceivings.length > 0) {
          const result = await Receiving.updateMany(
            {
              status: "pending",
              dueDate: { $exists: true, $ne: "", $lt: todayPhDateString },
            },
            {
              $set: { status: "overdue" },
            }
          );

          console.log(
            `💰 Updated ${result.modifiedCount} receiving(s) to overdue status`
          );
        } else {
          console.log("💰 No overdue receivings found");
        }

        console.log(
          `🎯 Overdue check completed successfully for ${todayPhDateString}.`
        );
      } catch (error) {
        console.error("💥 Fatal error in overdue check job:", error);
      }
    },
    {
      timezone: "Asia/Manila",
    }
  );
};
