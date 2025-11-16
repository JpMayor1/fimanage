import { FaHandHoldingUsd, FaWallet } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { IoMdGift } from "react-icons/io";
import {
  MdBusinessCenter,
  MdMoreHoriz,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { TbCash, TbMoneybag, TbPigMoney } from "react-icons/tb";

export const investmentIcons = {
  MdBusinessCenter, // Business investment
  TbMoneybag, // Money bag
  TbCash, // Cash
  TbPigMoney, // Piggy bank (investments/investment storage)
  FaWallet, // Wallet
  FaHandHoldingUsd, // Hand holding money (receiving money)
  GiReceiveMoney, // Receiving money
  MdOutlineSupportAgent, // Side job / commission / agent fees
  IoMdGift, // Gift investment
  MdMoreHoriz, // Other investment
};

export type InvestmentIconKey = keyof typeof investmentIcons;
