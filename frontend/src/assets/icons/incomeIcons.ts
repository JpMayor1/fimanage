import { GiReceiveMoney } from "react-icons/gi";
import { IoMdGift } from "react-icons/io";
import {
  MdBusinessCenter,
  MdMoreHoriz,
  MdOutlineSupportAgent,
} from "react-icons/md";

export const incomeIcons = {
  MdMoreHoriz,
  MdBusinessCenter,
  MdOutlineSupportAgent,
  IoMdGift,
  GiReceiveMoney,
};

export type IncomeIconKey = keyof typeof incomeIcons;
