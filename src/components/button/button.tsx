import React, { FC } from "react";
import styles from "../../styles/components/atoms/button.module.scss";
import Link from "next/link";
import { useRouter } from 'next/router'; // Import useRouter hook from Next.js

type ButtonSize = "small" | "medium" | "large";
type ButtonType = "primary" | "secondary" | "danger" | "tertiary" | "success";

interface ButtonProps {
  text?: string;
  size?: ButtonSize;
  type?: ButtonType;
  htmlType?: "button" | "submit" | "reset"; // Add this line
  icon?: React.ReactNode;
  onClick?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
  fullWidth?: boolean;
  href?: string;
  className?: string; // added className prop here
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  text,
  size = "medium",
  type = "primary",
  htmlType = "button", // Default to 'button'
  icon,
  onClick,
  fullWidth = false,
  href,
  className = "",
  isLoading = false,
  disabled = false,
}) => {
  const classNames = [
    styles.button,
    styles[type],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className, // added className here
  ].join(" ");
  const handleLinkClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault(); // Prevent link navigation if disabled
      return;
    }
    if (onClick) {
      onClick(e as any);
    }
  };
  const router = useRouter(); // Use the useRouter hook for navigation control

  const ButtonOrLink = (href && disabled == false) ? (
    <Link href={href}>
      <span className={`${classNames} ${disabled && 'disabledLink'}`} onClick={handleLinkClick} aria-disabled={disabled ? "true" : "false"}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {text}
    </span>
  </Link>
  ) : (
    <button
      className={classNames}
      onClick={onClick}
      type={htmlType}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <span className={styles.spinner}></span>
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {text}
        </>
      )}
    </button>
  );

  return ButtonOrLink;
};

export default Button;
