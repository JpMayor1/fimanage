import { FaMoneyBillTransfer, FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoIosBusiness } from "react-icons/io";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import {
  MdCurrencyBitcoin,
  MdMoreHoriz,
  MdOutlineAddBusiness,
} from "react-icons/md";

export const investmentIcons = {
  MdMoreHoriz,
  IoIosBusiness,
  MdOutlineAddBusiness,
  LiaBusinessTimeSolid,
  FaMoneyBillTrendUp,
  FaMoneyBillTransfer,
  MdCurrencyBitcoin,
};

export type InvestmentIconKey = keyof typeof investmentIcons;
