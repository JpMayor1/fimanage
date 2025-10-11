import {
  FaCar,
  FaHeartbeat,
  FaHome,
  FaMoneyBillWave,
  FaRegCreditCard,
  FaShoppingCart,
  FaUtensils,
} from "react-icons/fa";
import { GiClothes, GiPayMoney, GiTakeMyMoney } from "react-icons/gi";
import { MdMoreHoriz, MdOutlineSchool } from "react-icons/md";
import { TbBus, TbPigOff, TbReceipt } from "react-icons/tb";

export const expenseIcons = {
  FaUtensils, // Food & dining
  FaShoppingCart, // Shopping / groceries
  FaMoneyBillWave, // Bills & utilities
  FaCar, // Car / transport
  FaHome, // Housing / rent
  FaRegCreditCard, // Credit card payments
  FaHeartbeat, // Health / medical
  MdOutlineSchool, // Education
  GiTakeMyMoney, // General expenses
  GiClothes, // Clothing / apparel
  GiPayMoney, // Paying money
  TbReceipt, // Receipts / invoices
  TbPigOff, // Withdrawals / savings spent
  TbBus, // Commuting / transport
  MdMoreHoriz, // Other expenses
};

export type ExpenseIconKey = keyof typeof expenseIcons;
