import React, { useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = "primary", size = "md", ...props }) => {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const baseStyle: React.CSSProperties = {
    borderRadius: 10,
    fontWeight: 700,
    transition: "all 180ms cubic-bezier(.2,.9,.3,1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    outline: "none",
    border: "none",
  };

  const variantStyle: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(90deg,#2563eb,#7c3aed)",
      color: "#fff",
      boxShadow: hover ? "0 12px 30px rgba(37,99,235,0.16)" : "0 8px 20px rgba(37,99,235,0.12)",
      transform: hover ? "translateY(-2px)" : "none",
    },
    secondary: {
      background: "linear-gradient(180deg,#f3f4f6,#ffffff)",
      color: "#0f172a",
      boxShadow: "none",
    },
    danger: {
      background: "linear-gradient(90deg,#ef4444,#dc2626)",
      color: "#fff",
      boxShadow: hover ? "0 12px 30px rgba(220,38,38,0.12)" : "0 8px 20px rgba(220,38,38,0.10)",
      transform: hover ? "translateY(-2px)" : "none",
    },
    ghost: {
      background: "transparent",
      color: "#0f172a",
    },
  };

  const sizeStyle: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 10px", fontSize: 13 },
    md: { padding: "8px 14px", fontSize: 15 },
    lg: { padding: "12px 18px", fontSize: 16 },
  };

  const { style: userStyle, ...rest } = props as any;

  return (
    <button
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{ ...baseStyle, ...variantStyle[variant], ...sizeStyle[size], ...(userStyle || {}) }}
    >
      {children}
    </button>
  );
};
