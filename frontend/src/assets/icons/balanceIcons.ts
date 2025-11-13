import { FaHandHoldingUsd, FaWallet } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { IoMdGift } from "react-icons/io";
import {
  MdBusinessCenter,
  MdMoreHoriz,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { TbCash, TbMoneybag, TbPigMoney } from "react-icons/tb";

export const balanceIcons = {
  FaWallet, // Wallet
  TbMoneybag, // Money bag
  MdBusinessCenter, // Business balance
  TbCash, // Cash
  TbPigMoney, // Piggy bank (savings/balance storage)
  FaHandHoldingUsd, // Hand holding money (receiving money)
  GiReceiveMoney, // Receiving money
  MdOutlineSupportAgent, // Side job / commission / agent fees
  IoMdGift, // Gift balance
  MdMoreHoriz, // Other balance
};

export type BalanceIconKey = keyof typeof balanceIcons;
