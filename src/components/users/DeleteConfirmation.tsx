"use client";
import { useState, useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { User } from "@/types/user";
import { useThemeStore } from "@/stores/themeStore";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  open: boolean;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation = ({
  open,
  user,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    }
    setMounted(false);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  const { isDarkMode } = useThemeStore();

  const styles = {
    overlay: {
      position: "fixed" as const,
      inset: 0,
      background: isDarkMode ? "rgba(2,6,23,0.7)" : "rgba(2,6,23,0.45)",
      backdropFilter: "blur(6px)",
      zIndex: 50,
      padding: 20,
    },
    content: {
      position: "fixed" as const,
      top: "50%",
      left: "50%",
      transform: mounted
        ? "translate(-50%,-50%) scale(1)"
        : "translate(-50%,-50%) scale(0.98)",
      opacity: mounted ? 1 : 0,
      transition:
        "transform 220ms cubic-bezier(.2,.9,.3,1), opacity 220ms ease",
      width: "min(92vw,520px)",
      borderRadius: 12,
      padding: 18,
      background: isDarkMode
        ? "linear-gradient(180deg,#081226,#041025)"
        : "linear-gradient(180deg,#fff,#fbfdff)",
      boxShadow: isDarkMode
        ? "0 30px 90px rgba(2,6,23,0.7)"
        : "0 24px 60px rgba(2,6,23,0.12)",
      zIndex: 60,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    header: { display: "flex", gap: 12, alignItems: "flex-start" },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDarkMode
        ? "linear-gradient(180deg,#2b0b0f,#2a0710)"
        : "linear-gradient(180deg,#fff1f2,#fee2e2)",
      color: isDarkMode ? "#ffb4b4" : "#dc2626",
    },
    title: {
      margin: 0,
      fontSize: 16,
      fontWeight: 800,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    description: {
      margin: 0,
      color: isDarkMode ? "#94a3b8" : "#6b7280",
      marginTop: 4,
    },
    userName: { fontWeight: 800, color: isDarkMode ? "#fff" : "#111827" },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 12,
    },
    cancel: {
      padding: "8px 12px",
      borderRadius: 10,
      background: "transparent",
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.04)"
        : "1px solid rgba(15,23,42,0.06)",
      cursor: "pointer",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    confirm: {
      padding: "8px 12px",
      borderRadius: 10,
      background: "#ef4444",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: isDarkMode
        ? "0 10px 30px rgba(239,68,68,0.12)"
        : "0 8px 20px rgba(239,68,68,0.12)",
    },
  } as const;

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay style={styles.overlay} />
        <AlertDialog.Content style={styles.content}>
          <div style={styles.header}>
            <div style={styles.icon}>
              <Trash2 size={18} />
            </div>
            <div>
              <AlertDialog.Title style={styles.title}>
                Delete User
              </AlertDialog.Title>
              <AlertDialog.Description style={styles.description}>
                Are you sure you want to delete{" "}
                <span style={styles.userName}>{user?.name}</span>? This action
                cannot be undone.
              </AlertDialog.Description>
            </div>
          </div>

          <div style={styles.actions}>
            <AlertDialog.Cancel asChild>
              <button onClick={handleCancel} style={styles.cancel}>
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={handleConfirm} style={styles.confirm}>
                Delete User
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
