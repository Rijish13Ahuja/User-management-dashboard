import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  className,
}) => {
  const styles = {
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "8px 10px",
      fontSize: 14,
      borderRadius: 10,
      border: "1px solid rgba(15,23,42,0.06)",
      background: "#fff",
      cursor: "pointer",
    },
    content: {
      overflow: "hidden",
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    },
    viewport: { padding: 6 },
    item: {
      position: "relative" as const,
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      fontSize: 14,
      borderRadius: 8,
      cursor: "pointer",
    },
    itemIndicator: { position: "absolute", left: 8 },
  } as const;

  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger style={styles.trigger}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown size={16} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content style={styles.content}>
          <SelectPrimitive.Viewport style={styles.viewport}>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                style={styles.item}
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator style={styles.itemIndicator}>
                  <Check size={16} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};
