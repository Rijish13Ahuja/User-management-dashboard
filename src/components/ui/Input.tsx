import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  const styles: Record<string, React.CSSProperties> = {
    wrapper: { width: "100%" },
    label: { display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 10,
      border: error ? "1px solid #ef4444" : "1px solid rgba(15,23,42,0.06)",
      outline: "none",
      boxShadow: "inset 0 -1px 0 rgba(2,6,23,0.02)",
      fontSize: 14,
    },
    error: { marginTop: 6, fontSize: 13, color: "#ef4444" },
  };

  const { style: userStyle, ...rest } = props as any;

  return (
    <div style={styles.wrapper}>
      {label && <label style={styles.label}>{label}</label>}
      <input style={{ ...styles.input, ...(userStyle || {}) }} {...rest} />
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};
