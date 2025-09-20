import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  icon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

const TextField = ({
  icon,
  rightIcon,
  containerClassName = "",
  inputClassName = "",
  ...props
}: TextFieldProps) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-lg pointer-events-none">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full ${icon ? "pl-11" : "pl-4"} ${
          rightIcon ? "pr-11" : "pr-4"
        } py-3 rounded-xl border border-yellow focus:border-yellow-400 bg-primary/50 text-white placeholder-white/40 outline-none transition ${inputClassName}`}
      />
      {rightIcon && (
        <span className="absolute right-4 top-4 cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  );
};

export default TextField;
