import { FaHandHoldingUsd, FaWallet } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { IoMdGift } from "react-icons/io";
import {
  MdBusinessCenter,
  MdMoreHoriz,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { TbCash, TbMoneybag, TbPigMoney } from "react-icons/tb";

export const incomeIcons = {
  MdBusinessCenter, // Business income
  TbMoneybag, // Money bag
  TbCash, // Cash
  TbPigMoney, // Piggy bank (savings/income storage)
  FaWallet, // Wallet
  FaHandHoldingUsd, // Hand holding money (receiving money)
  GiReceiveMoney, // Receiving money
  MdOutlineSupportAgent, // Side job / commission / agent fees
  IoMdGift, // Gift income
  MdMoreHoriz, // Other income
};

export type IncomeIconKey = keyof typeof incomeIcons;
