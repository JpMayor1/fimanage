import {
  FaCar,
  FaHeartbeat,
  FaHome,
  FaRegCreditCard,
  FaShoppingCart,
  FaUtensils,
} from "react-icons/fa";
import { GiClothes, GiPayMoney } from "react-icons/gi";
import { MdFastfood, MdMoreHoriz, MdOutlineSchool } from "react-icons/md";
import { TbBus, TbReceipt } from "react-icons/tb";

export const expenseIcons = {
  MdMoreHoriz,
  FaUtensils,
  MdFastfood,
  FaShoppingCart,
  FaHome,
  TbReceipt,
  FaRegCreditCard,
  FaHeartbeat,
  MdOutlineSchool,
  GiClothes,
  TbBus,
  FaCar,
  GiPayMoney,
};

export type ExpenseIconKey = keyof typeof expenseIcons;
