import type { JSX, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  type: "button" | "submit";
  variant: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-300",
  secondary: "border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:text-slate-400",
};

export const Button = ({ type, variant, disabled = false, onClick, children }: ButtonProps): JSX.Element => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </button>
  );
};
