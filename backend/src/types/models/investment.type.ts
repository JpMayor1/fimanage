import { Document, Schema } from "mongoose";

export type InvestmentType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  icon: string;
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

export type InvestmentFilterType = Partial<
  Pick<InvestmentType, "description" | "name">
>;

export type InvestmentDocumentType = InvestmentType & Document;
