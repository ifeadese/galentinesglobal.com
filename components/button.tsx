import React from "react";
import styles from "components/button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  disabled?: boolean;
}

const Button = ({ children, variant, disabled = false, ...rest }: ButtonProps) => {
  return (
    <button
      className={` ${styles["default"]} ${styles[variant]} ${disabled ? styles["disabled"] : ""
        }`}
      {...rest}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
