import Dept from "@/models/dept.model";
import Source from "@/models/source.model";
import { DeptType } from "@/types/models/dept.type";
import { formatDate } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";
import { ensureNumber } from "@/utils/number/ensureNumber";

export const getDeptsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Dept.countDocuments({ userId });
  const depts = await Dept.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { depts, total };
};

export const addDeptS = async (data: Partial<DeptType>) => {
  // Ensure numeric fields are never null (0 is acceptable)
  const remaining = data.remaining != null ? Number(data.remaining) || 0 : 0;
  const interest = data.interest != null ? Number(data.interest) || 0 : 0;

  // If source is provided, increase source balance (opposite of receiving)
  if (data.source) {
    const source = await Source.findById(data.source);
    if (!source) throw new AppError("Source not found", 404);

    // Create dept first to get its ID
    const newDept = await Dept.create({
      ...data,
      remaining,
      interest,
      dueDate: formatDate(data.dueDate || ""),
    });

    // Then update source with the dept ID - increase balance (like income)
    await Source.findByIdAndUpdate(data.source, {
      $inc: {
        balance: remaining,
        income: remaining,
      },
      $push: {
        transactions: {
          transactionId: `dept-${newDept._id}`,
          type: "dept",
          note: data.note || `Dept from ${data.lender}`,
          amount: remaining,
        },
      },
    });

    return newDept;
  }

  const newDept = await Dept.create({
    ...data,
    remaining,
    interest,
    dueDate: formatDate(data.dueDate || ""),
  });
  return newDept;
};

export const updateDeptS = async (id: string, data: Partial<DeptType>) => {
  const dept = await Dept.findById(id);
  if (!dept) throw new AppError("Dept not found", 404);

  const oldRemaining = ensureNumber(dept.remaining);
  const oldSource = dept.source?.toString();
  const newRemaining = data.remaining != null ? Number(data.remaining) || 0 : oldRemaining;
  const newSource = data.source || null;

  // Handle source changes
  if (oldSource || newSource) {
    // If source was set and is being removed or changed
    if (oldSource && (!newSource || newSource !== oldSource)) {
      // Restore balance to old source (decrease like expense)
      await Source.findByIdAndUpdate(oldSource, {
        $inc: {
          balance: -oldRemaining,
          income: -oldRemaining,
        },
        $pull: {
          transactions: { transactionId: `dept-${id}` },
        },
      });
    }

    // If new source is being set (either new or changed)
    if (newSource && newSource !== oldSource) {
      // Increase new source balance (like income)
      await Source.findByIdAndUpdate(newSource, {
        $inc: {
          balance: newRemaining,
          income: newRemaining,
        },
        $push: {
          transactions: {
            transactionId: `dept-${id}`,
            type: "dept",
            note: data.note || dept.note || `Dept from ${data.lender || dept.lender}`,
            amount: newRemaining,
          },
        },
      });
    } else if (newSource && newSource === oldSource) {
      // Same source, but remaining amount might have changed
      const remainingDiff = newRemaining - oldRemaining;
      if (remainingDiff !== 0) {
        // Update source balance
        await Source.findByIdAndUpdate(newSource, {
          $inc: {
            balance: remainingDiff,
            income: remainingDiff,
          },
        });
      }
    }
  }

  // Ensure numeric fields are never null (0 is acceptable)
  const updateData: Partial<DeptType> = { ...data };
  if (data.remaining != null) {
    updateData.remaining = Number(data.remaining) || 0;
  }
  if (data.interest != null) {
    updateData.interest = Number(data.interest) || 0;
  }
  updateData.dueDate = formatDate(data.dueDate || "");

  const updatedDept = await Dept.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  return updatedDept;
};

export const deleteDeptS = async (id: string) => {
  const dept = await Dept.findById(id);
  if (!dept) throw new AppError("Dept not found", 404);

  // If source was set, restore the balance (decrease like expense)
  if (dept.source) {
    const remaining = ensureNumber(dept.remaining);
    await Source.findByIdAndUpdate(dept.source, {
      $inc: {
        balance: -remaining,
        income: -remaining,
      },
      $pull: {
        transactions: { transactionId: `dept-${id}` },
      },
    });
  }

  const deletedDept = await Dept.findByIdAndDelete(id);
  return deletedDept;
};
