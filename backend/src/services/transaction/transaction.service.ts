import Dept from "@/models/dept.model";
import Receiving from "@/models/receiving.model";
import Source from "@/models/source.model";
import Transaction from "@/models/transaction.model";
import type { transactionType } from "@/types/models/transaction.type";
import { AppError } from "@/utils/error/appError";

const ensureNumber = (val: unknown): number => {
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

    await Source.findByIdAndUpdate(source, {
      $inc: {
        income: amt,
        balance: amt,
      },
      $push:
        factor === 1
          ? {
              transactions: {
                transactionId: trx._id,
                note,
                amount,
              },
            }
          : undefined,
    });

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

    await Source.findByIdAndUpdate(source, {
      $inc: {
        expense: amt,
        balance: -amt,
      },
      $push:
        factor === 1
          ? {
              transactions: {
                transactionId: trx._id,
                note,
                amount,
              },
            }
          : undefined,
    });

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

    await Source.findByIdAndUpdate(from, {
      $inc: {
        balance: -amt,
      },
    });

    await Source.findByIdAndUpdate(to, {
      $inc: {
        balance: amt,
      },
    });
  }

  if (type === "dept") {
    const { source, amount, note } = trx.dept;
    if (!source) throw new AppError("Dept id is required.", 400);
    const amt = ensureNumber(amount) * factor;

    const dept = await Dept.findById(source);
    if (!dept) throw new AppError("Dept not found.", 404);

    const newRemaining = Math.max(0, ensureNumber(dept.remaining) - amt);
    const newStatus =
      newRemaining === 0
        ? "paid"
        : dept.status === "paid"
        ? "pending"
        : dept.status;

    await Dept.findByIdAndUpdate(source, {
      $set: {
        remaining: newRemaining,
        status: newStatus,
      },
      $push:
        factor === 1
          ? {
              transactions: {
                transactionId: trx._id,
                note,
                amount,
              },
            }
          : undefined,
    });

    if (factor === -1) {
      await Dept.findByIdAndUpdate(source, {
        $pull: {
          transactions: { transactionId: trx._id },
        },
      });
    }
  }

  if (type === "receiving") {
    const { source, amount, note } = trx.receiving;
    if (!source) throw new AppError("Receiving id is required.", 400);
    const amt = ensureNumber(amount) * factor;

    const receiving = await Receiving.findById(source);
    if (!receiving) throw new AppError("Receiving not found.", 404);

    const newRemaining = Math.max(0, ensureNumber(receiving.remaining) - amt);
    const newStatus =
      newRemaining === 0
        ? "paid"
        : receiving.status === "paid"
        ? "pending"
        : receiving.status;

    await Receiving.findByIdAndUpdate(source, {
      $set: {
        remaining: newRemaining,
        status: newStatus,
      },
      $push:
        factor === 1
          ? {
              transactions: {
                transactionId: trx._id,
                note,
                amount,
              },
            }
          : undefined,
    });

    if (factor === -1) {
      await Receiving.findByIdAndUpdate(source, {
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

  const created = await Transaction.create({
    ...data,
    userId,
  });

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

  const updated = await Transaction.findByIdAndUpdate(
    id,
    { ...data },
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
