import Receiving from "@/models/receiving.model";
import Source from "@/models/source.model";
import { ReceivingType } from "@/types/models/receiving.type";
import { formatDate } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";
import { ensureNumber } from "@/utils/number/ensureNumber";

export const getReceivingsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Receiving.countDocuments({ userId });
  const receivings = await Receiving.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { receivings, total };
};

export const addReceivingS = async (data: Partial<ReceivingType>) => {
  // Ensure numeric fields are never null (0 is acceptable)
  const remaining = data.remaining != null ? Number(data.remaining) || 0 : 0;
  const interest = data.interest != null ? Number(data.interest) || 0 : 0;

  // If source is provided, deduct from source balance
  if (data.source) {
    const source = await Source.findById(data.source);
    if (!source) throw new AppError("Source not found", 404);

    const currentBalance = ensureNumber(source.balance);
    if (remaining > currentBalance) {
      throw new AppError(
        `Insufficient balance. Receiving amount (${remaining}) exceeds available balance (${currentBalance}).`,
        400
      );
    }

    // Create receiving first to get its ID
    const newReceiving = await Receiving.create({
      ...data,
      remaining,
      interest,
      dueDate: formatDate(data.dueDate || ""),
    });

    // Then update source with the receiving ID (add at beginning with $position: 0)
    await Source.findByIdAndUpdate(data.source, {
      $inc: {
        balance: -remaining,
        expense: remaining,
      },
      $push: {
        transactions: {
          $each: [{
            transactionId: `receiving-${newReceiving._id}`,
            type: "receiving",
            note: data.note || `Receiving from ${data.borrower}`,
            amount: remaining,
          }],
          $position: 0,
        },
      },
    });

    return newReceiving;
  }

  const newReceiving = await Receiving.create({
    ...data,
    remaining,
    interest,
    dueDate: formatDate(data.dueDate || ""),
  });
  return newReceiving;
};

export const updateReceivingS = async (
  id: string,
  data: Partial<ReceivingType>
) => {
  const receiving = await Receiving.findById(id);
  if (!receiving) throw new AppError("Receiving not found", 404);

  const oldRemaining = ensureNumber(receiving.remaining);
  const oldSource = receiving.source?.toString();
  const newRemaining =
    data.remaining != null ? Number(data.remaining) || 0 : oldRemaining;
  const newSource = data.source || null;

  // Handle source changes
  if (oldSource || newSource) {
    // If source was set and is being removed or changed
    if (oldSource && (!newSource || newSource !== oldSource)) {
      // Restore balance to old source
      await Source.findByIdAndUpdate(oldSource, {
        $inc: {
          balance: oldRemaining,
          expense: -oldRemaining,
        },
        $pull: {
          transactions: { transactionId: `receiving-${id}` },
        },
      });
    }

    // If new source is being set (either new or changed)
    if (newSource && newSource !== oldSource) {
      const source = await Source.findById(newSource);
      if (!source) throw new AppError("Source not found", 404);

      const currentBalance = ensureNumber(source.balance);
      if (newRemaining > currentBalance) {
        throw new AppError(
          `Insufficient balance. Receiving amount (${newRemaining}) exceeds available balance (${currentBalance}).`,
          400
        );
      }

      // Deduct from new source balance and add to transactions (add at beginning)
      await Source.findByIdAndUpdate(newSource, {
        $inc: {
          balance: -newRemaining,
          expense: newRemaining,
        },
        $push: {
          transactions: {
            $each: [{
              transactionId: `receiving-${id}`,
              type: "receiving",
              note:
                data.note ||
                receiving.note ||
                `Receiving from ${data.borrower || receiving.borrower}`,
              amount: newRemaining,
            }],
            $position: 0,
          },
        },
      });
    } else if (newSource && newSource === oldSource) {
      // Same source, but remaining amount or note might have changed
      const remainingDiff = newRemaining - oldRemaining;
      const newNote = data.note || receiving.note || `Receiving from ${data.borrower || receiving.borrower}`;
      
      // Fetch source once for both balance check and transaction update
      const source = await Source.findById(newSource);
      if (!source) throw new AppError("Source not found", 404);
      
      if (remainingDiff !== 0) {
        if (remainingDiff > 0) {
          // Remaining increased, need more balance
          const currentBalance = ensureNumber(source.balance);
          if (remainingDiff > currentBalance) {
            throw new AppError(
              `Insufficient balance. Additional amount (${remainingDiff}) exceeds available balance (${currentBalance}).`,
              400
            );
          }
        }
        
        // Update source balance
        await Source.findByIdAndUpdate(newSource, {
          $inc: {
            balance: -remainingDiff,
            expense: remainingDiff,
          },
        });
      }
      
      // Update the transaction entry in source's transactions array
      const transactionIndex = source.transactions.findIndex(
        (t) => t.transactionId === `receiving-${id}`
      );
      if (transactionIndex !== -1) {
        source.transactions[transactionIndex].amount = newRemaining;
        source.transactions[transactionIndex].note = newNote;
        await source.save();
      }
    }
  }

  // Ensure numeric fields are never null (0 is acceptable)
  const updateData: Partial<ReceivingType> = { ...data };
  if (data.remaining != null) {
    updateData.remaining = Number(data.remaining) || 0;
  }
  if (data.interest != null) {
    updateData.interest = Number(data.interest) || 0;
  }
  updateData.dueDate = formatDate(data.dueDate || "");

  const updatedReceiving = await Receiving.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  return updatedReceiving;
};

export const deleteReceivingS = async (id: string) => {
  const receiving = await Receiving.findById(id);
  if (!receiving) throw new AppError("Receiving not found", 404);

  // If source was set, restore the balance
  if (receiving.source) {
    const remaining = ensureNumber(receiving.remaining);
    await Source.findByIdAndUpdate(receiving.source, {
      $inc: {
        balance: remaining,
        expense: -remaining,
      },
      $pull: {
        transactions: { transactionId: `receiving-${id}` },
      },
    });
  }

  const deletedReceiving = await Receiving.findByIdAndDelete(id);
  return deletedReceiving;
};
