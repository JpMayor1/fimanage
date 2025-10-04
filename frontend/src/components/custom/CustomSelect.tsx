import type { ReactNode, SelectHTMLAttributes } from "react";
import { BiChevronDown } from "react-icons/bi";

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
  icon?: ReactNode;
}

const CustomSelect = ({
  children,
  containerClassName = "",
  className = "",
  icon = <BiChevronDown className="text-gray-400" size={20} />,
  ...props
}: CustomSelectProps) => (
  <div className={`w-full relative ${containerClassName}`}>
    <select
      {...props}
      className={`appearance-none w-full py-3.5 px-4 rounded-xl border border-yellow focus:border-yellow-400 bg-primary/50 text-white placeholder-white/40 outline-none transition pr-10 ${className}`}
    >
      {children}
    </select>
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      {icon}
    </span>
  </div>
);

export default CustomSelect;
