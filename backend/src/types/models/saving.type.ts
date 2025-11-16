import { Document, Schema } from "mongoose";

export type SavingType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  name: string;
  description: string;
  amount: number;
  annualRate?: string;
  frequency?:
    | "Daily"
    | "Weekly"
    | "Biweekly"
    | "Semimonthly"
    | "Monthly"
    | "Bimonthly"
    | "Quarterly"
    | "Semiannual"
    | "Annual"
    | "Biennial"
    | "On Maturity"
    | string;
  dt: string;
};

export type SavingFilterType = Partial<
  Pick<SavingType, "description" | "name">
>;

export type SavingDocumentType = SavingType & Document;
