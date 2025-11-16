import { FaWallet } from "react-icons/fa";
import { MdMoreHoriz, MdSavings } from "react-icons/md";
import { TbMoneybag, TbPigMoney } from "react-icons/tb";

export const savingIcons = {
  MdMoreHoriz,
  FaWallet,
  TbPigMoney,
  MdSavings,
  TbMoneybag,
};

export type SavingIconKey = keyof typeof savingIcons;
