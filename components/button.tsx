import React from "react";
import Link from "next/link";
import styles from "components/button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  disabled?: boolean;
  /** When set, the button renders as a Next.js link with the same styling */
  href?: string;
}

const Button = ({ children, variant, disabled = false, href, className, style, ...rest }: ButtonProps) => {
  const classes = [styles["default"], styles[variant], disabled ? styles["disabled"] : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} style={style} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} style={style} {...rest} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
