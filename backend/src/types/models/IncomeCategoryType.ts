export type IncomeCategoryType = {
  _id: string;
  icon: string;
  name: string;
};

export type IncomeCategoryFilterType = Partial<
  Pick<IncomeCategoryType, "_id" | "name">
>;

export type IncomeCategoryDocumentType = IncomeCategoryType & Document;
