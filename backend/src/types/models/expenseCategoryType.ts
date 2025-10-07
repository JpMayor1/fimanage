export type ExpenseCategoryType = {
  _id: string;
  icon: string;
  name: string;
};

export type ExpenseCategoryFilterType = Partial<
  Pick<ExpenseCategoryType, "_id" | "name">
>;

export type ExpenseCategoryDocumentType = ExpenseCategoryType & Document;
