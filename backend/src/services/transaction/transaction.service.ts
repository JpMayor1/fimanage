import Dept from "@/models/dept.model";
import Receiving from "@/models/receiving.model";
import Source from "@/models/source.model";
import Transaction from "@/models/transaction.model";
import type { transactionType } from "@/types/models/transaction.type";
import { AppError } from "@/utils/error/appError";

// Ensure amounts are never null (0 is acceptable)
const ensureNumber = (val: unknown): number => {
  if (val == null) return 0;
  const n = typeof val === "number" ? val : Number(val);
  if (Number.isNaN(n)) return 0;
  return n;
};

const applyTransactionEffects = async (
  trx: transactionType,
  factor: 1 | -1
) => {
  const { type } = trx;

  if (type === "income") {
    const { source, amount, note } = trx.income;
    if (!source) throw new AppError("Income source is required.", 400);
    const amt = ensureNumber(amount) * factor;

    const update: Record<string, unknown> = {
      $inc: {
        income: amt,
        balance: amt,
      },
    };

    if (factor === 1) {
      update.$push = {
        transactions: {
          transactionId: trx._id,
          type: "income",
          note,
          amount,
        },
      };
    }

    await Source.findByIdAndUpdate(source, update);

    if (factor === -1) {
      await Source.findByIdAndUpdate(source, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }
  }

  if (type === "expense") {
    const { source, amount, note } = trx.expense;
    if (!source) throw new AppError("Expense source is required.", 400);
    const amt = ensureNumber(amount) * factor;

    // Validate source has sufficient balance (only when adding, factor === 1)
    if (factor === 1) {
      const sourceDoc = await Source.findById(source);
      if (!sourceDoc) throw new AppError("Source not found.", 404);
      
      const currentBalance = ensureNumber(sourceDoc.balance);
      if (amt > currentBalance) {
        throw new AppError(
          `Insufficient balance. Expense amount (${amt}) exceeds available balance (${currentBalance}).`,
          400
        );
      }
    }

    const update: Record<string, unknown> = {
      $inc: {
        expense: amt,
        balance: -amt,
      },
    };

    if (factor === 1) {
      update.$push = {
        transactions: {
          transactionId: trx._id,
          type: "expense",
          note,
          amount,
        },
      };
    }

    await Source.findByIdAndUpdate(source, update);

    if (factor === -1) {
      await Source.findByIdAndUpdate(source, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }
  }

  if (type === "transfer") {
    const { from, to, amount } = trx.transfer;
    if (!from || !to) throw new AppError("Transfer from/to are required.", 400);
    const amt = ensureNumber(amount) * factor;

    // Validate "from" source has sufficient balance (only when adding, factor === 1)
    if (factor === 1) {
      const fromSource = await Source.findById(from);
      if (!fromSource) throw new AppError("Source (from) not found.", 404);
      
      const currentBalance = ensureNumber(fromSource.balance);
      if (amt > currentBalance) {
        throw new AppError(
          `Insufficient balance. Transfer amount (${amt}) exceeds available balance (${currentBalance}) in source.`,
          400
        );
      }
    }

    const updateFrom: Record<string, unknown> = {
      $inc: {
        balance: -amt,
      },
    };

    const updateTo: Record<string, unknown> = {
      $inc: {
        balance: amt,
      },
    };

    // Only attach transaction details when applying the transaction (factor === 1)
    if (factor === 1) {
      updateFrom.$push = {
        transactions: {
          transactionId: trx._id,
          type: "transfer",
          note: "Transfer out",
          amount,
        },
      };

      updateTo.$push = {
        transactions: {
          transactionId: trx._id,
          type: "transfer",
          note: "Transfer in",
          amount,
        },
      };
    }

    await Source.findByIdAndUpdate(from, updateFrom);
    await Source.findByIdAndUpdate(to, updateTo);

    // When reversing (factor === -1), also remove the transaction references
    if (factor === -1) {
      await Source.findByIdAndUpdate(from, {
        $pull: { transactions: { transactionId: trx._id } },
      });
      await Source.findByIdAndUpdate(to, {
        $pull: { transactions: { transactionId: trx._id } },
      });
    }
  }

  if (type === "dept") {
    const { source, moneySource, amount, note } = trx.dept;
    if (!source) throw new AppError("Dept id is required.", 400);
    if (!moneySource) throw new AppError("Money source is required for dept payment.", 400);
    const amt = ensureNumber(amount) * factor;

    const dept = await Dept.findById(source);
    if (!dept) throw new AppError("Dept not found.", 404);

    // Validate amount doesn't exceed remaining balance (only when adding, factor === 1)
    if (factor === 1) {
      const currentRemaining = ensureNumber(dept.remaining);
      if (amt > currentRemaining) {
        throw new AppError(
          `Payment amount (${amt}) cannot exceed remaining balance (${currentRemaining}).`,
          400
        );
      }
    }

    const newRemaining = Math.max(0, ensureNumber(dept.remaining) - amt);
    const newStatus =
      newRemaining === 0
        ? "paid"
        : dept.status === "paid"
        ? "pending"
        : dept.status;

    const update: Record<string, unknown> = {
      $set: {
        remaining: newRemaining,
        status: newStatus,
      },
    };

    if (factor === 1) {
      update.$push = {
        transactions: {
          transactionId: trx._id,
          note,
          amount,
        },
      };
    }

    await Dept.findByIdAndUpdate(source, update);

    if (factor === -1) {
      await Dept.findByIdAndUpdate(source, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }

    // Update money source balance (decrease like expense)
    // Validate money source has sufficient balance (only when adding, factor === 1)
    if (factor === 1) {
      const moneySourceDoc = await Source.findById(moneySource);
      if (!moneySourceDoc) throw new AppError("Money source not found.", 404);
      
      const currentBalance = ensureNumber(moneySourceDoc.balance);
      if (amt > currentBalance) {
        throw new AppError(
          `Insufficient balance. Dept payment amount (${amt}) exceeds available balance (${currentBalance}).`,
          400
        );
      }
    }

    const sourceUpdate: Record<string, unknown> = {
      $inc: {
        expense: amt,
        balance: -amt,
      },
    };

    if (factor === 1) {
      sourceUpdate.$push = {
        transactions: {
          transactionId: trx._id,
          type: "dept",
          note,
          amount,
        },
      };
    }

    await Source.findByIdAndUpdate(moneySource, sourceUpdate);

    if (factor === -1) {
      await Source.findByIdAndUpdate(moneySource, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }
  }

  if (type === "receiving") {
    const { source, moneySource, amount, note } = trx.receiving;
    if (!source) throw new AppError("Receiving id is required.", 400);
    if (!moneySource) throw new AppError("Money source is required for receiving payment.", 400);
    const amt = ensureNumber(amount) * factor;

    const receiving = await Receiving.findById(source);
    if (!receiving) throw new AppError("Receiving not found.", 404);

    // Validate amount doesn't exceed remaining balance (only when adding, factor === 1)
    if (factor === 1) {
      const currentRemaining = ensureNumber(receiving.remaining);
      if (amt > currentRemaining) {
        throw new AppError(
          `Receiving amount (${amt}) cannot exceed remaining balance (${currentRemaining}).`,
          400
        );
      }
    }

    const newRemaining = Math.max(0, ensureNumber(receiving.remaining) - amt);
    const newStatus =
      newRemaining === 0
        ? "paid"
        : receiving.status === "paid"
        ? "pending"
        : receiving.status;

    const update: Record<string, unknown> = {
      $set: {
        remaining: newRemaining,
        status: newStatus,
      },
    };

    if (factor === 1) {
      update.$push = {
        transactions: {
          transactionId: trx._id,
          note,
          amount,
        },
      };
    }

    await Receiving.findByIdAndUpdate(source, update);

    if (factor === -1) {
      await Receiving.findByIdAndUpdate(source, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }

    // Update money source balance (increase like income)
    const sourceUpdate: Record<string, unknown> = {
      $inc: {
        income: amt,
        balance: amt,
      },
    };

    if (factor === 1) {
      sourceUpdate.$push = {
        transactions: {
          transactionId: trx._id,
          type: "receiving",
          note,
          amount,
        },
      };
    }

    await Source.findByIdAndUpdate(moneySource, sourceUpdate);

    if (factor === -1) {
      await Source.findByIdAndUpdate(moneySource, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }
  }
};

export const getTransactionsS = async (
  userId: string,
  skip: number,
  limit: number,
  type?: transactionType["type"]
) => {
  const filter: Partial<transactionType> = { userId };
  if (type) {
    filter.type = type;
  }

  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { transactions, total };
};

export const addTransactionS = async (
  userId: string,
  data: Partial<transactionType>
) => {
  if (!data.type) throw new AppError("Transaction type is required.", 400);

  // Ensure amounts are never null (0 is acceptable)
  const transactionData: Partial<transactionType> = { ...data, userId };
  
  if (data.income) {
    transactionData.income = {
      ...data.income,
      amount: ensureNumber(data.income.amount),
    };
  }
  if (data.expense) {
    transactionData.expense = {
      ...data.expense,
      amount: ensureNumber(data.expense.amount),
    };
  }
  if (data.transfer) {
    transactionData.transfer = {
      ...data.transfer,
      amount: ensureNumber(data.transfer.amount),
    };
  }
  if (data.dept) {
    transactionData.dept = {
      ...data.dept,
      amount: ensureNumber(data.dept.amount),
      moneySource: data.dept.moneySource || "",
    };
  }
  if (data.receiving) {
    transactionData.receiving = {
      ...data.receiving,
      amount: ensureNumber(data.receiving.amount),
      moneySource: data.receiving.moneySource || "",
    };
  }

  const created = await Transaction.create(transactionData);

  await applyTransactionEffects(created.toObject() as transactionType, 1);

  return created;
};

export const updateTransactionS = async (
  id: string,
  userId: string,
  data: Partial<transactionType>
) => {
  const existing = await Transaction.findOne({ _id: id, userId });
  if (!existing) throw new AppError("Transaction not found.", 404);

  // Reverse previous effects
  await applyTransactionEffects(existing.toObject() as transactionType, -1);

  // Ensure amounts are never null (0 is acceptable)
  const updateData: Partial<transactionType> = { ...data };
  
  if (data.income) {
    updateData.income = {
      ...data.income,
      amount: ensureNumber(data.income.amount),
    };
  }
  if (data.expense) {
    updateData.expense = {
      ...data.expense,
      amount: ensureNumber(data.expense.amount),
    };
  }
  if (data.transfer) {
    updateData.transfer = {
      ...data.transfer,
      amount: ensureNumber(data.transfer.amount),
    };
  }
  if (data.dept) {
    updateData.dept = {
      ...data.dept,
      amount: ensureNumber(data.dept.amount),
      moneySource: data.dept.moneySource || "",
    };
  }
  if (data.receiving) {
    updateData.receiving = {
      ...data.receiving,
      amount: ensureNumber(data.receiving.amount),
      moneySource: data.receiving.moneySource || "",
    };
  }

  const updated = await Transaction.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
  if (!updated) throw new AppError("Transaction not found after update.", 404);

  // Apply new effects
  await applyTransactionEffects(updated.toObject() as transactionType, 1);

  return updated;
};

export const deleteTransactionS = async (id: string, userId: string) => {
  const existing = await Transaction.findOne({ _id: id, userId });
  if (!existing) throw new AppError("Transaction not found.", 404);

  await applyTransactionEffects(existing.toObject() as transactionType, -1);

  await Transaction.deleteOne({ _id: id, userId });

  return existing;
};
