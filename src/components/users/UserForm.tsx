"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { User, UserFormData } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useThemeStore } from "@/stores/themeStore";
import { X } from "lucide-react";

interface UserFormProps {
  open: boolean;
  user?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserForm = ({
  open,
  user,
  onSuccess,
  onCancel,
}: UserFormProps) => {
  const { createUser, updateUser, isCreating, isUpdating } = useUsers();
  const [isOpen, setIsOpen] = useState(open);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>();

  useEffect(() => {
    setIsOpen(open);
    if (open && user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("company", user.company.name);
    } else if (open) {
      reset();
    }
  }, [open, user, reset, setValue]);

  const onSubmit = async (data: UserFormData) => {
    if (user) {
      await updateUser({ id: user.id, userData: data });
    } else {
      await createUser(data);
    }
    onSuccess();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  const isLoading = isCreating || isUpdating;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    }
    setMounted(false);
  }, [isOpen]);

  const { isDarkMode } = useThemeStore();

  const styles = {
    overlay: {
      position: "fixed" as const,
      inset: 0,
      background: isDarkMode ? "rgba(2,6,23,0.7)" : "rgba(2,6,23,0.45)",
      backdropFilter: "blur(6px) saturate(120%)",
      zIndex: 50,
      padding: 20,
    },
    content: {
      position: "fixed" as const,
      top: "50%",
      left: "50%",
      transform: mounted
        ? "translate(-50%,-50%) scale(1)"
        : "translate(-50%,-50%) scale(0.985)",
      opacity: mounted ? 1 : 0,
      transition:
        "transform 240ms cubic-bezier(.2,.9,.3,1), opacity 240ms ease",
      width: "min(92vw,720px)",
      borderRadius: 16,
      padding: 20,
      background: isDarkMode
        ? "linear-gradient(180deg,#081226,#041025)"
        : "linear-gradient(180deg,#ffffff,#fbfdff)",
      boxShadow: isDarkMode
        ? "0 40px 120px rgba(2,6,23,0.7)"
        : "0 30px 80px rgba(2,6,23,0.18)",
      transformOrigin: "center",
      zIndex: 60,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    title: { margin: 0, fontSize: 18, fontWeight: 800, color: "#0b1220" },
    closeBtn: {
      border: "none",
      background: "transparent",
      width: 36,
      height: 36,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      cursor: "pointer",
    },
    form: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 },
    formGroup: { display: "flex", flexDirection: "column" as const, gap: 6 },
    label: {
      fontSize: 13,
      fontWeight: 700,
      color: isDarkMode ? "#e6eef8" : "#374151",
    },
    input: {
      padding: "10px 12px",
      borderRadius: 10,
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.04)"
        : "1px solid rgba(15,23,42,0.06)",
      outline: "none",
      fontSize: 14,
      boxShadow: isDarkMode
        ? "inset 0 -1px 0 rgba(255,255,255,0.02)"
        : "inset 0 -1px 0 rgba(2,6,23,0.02)",
      background: isDarkMode ? "#071129" : "#fff",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    error: { color: "#ef4444", fontSize: 12 },
    actions: {
      gridColumn: "1 / -1",
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 6,
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
    submit: {
      padding: "8px 12px",
      borderRadius: 10,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: isDarkMode
        ? "0 12px 35px rgba(37,99,235,0.14)"
        : "0 8px 20px rgba(37,99,235,0.12)",
    },
    loadingSmall: {
      width: 18,
      height: 18,
      borderRadius: 999,
      border: "2px solid rgba(255,255,255,0.2)",
      borderTopColor: "#fff",
      animation: "spin 700ms linear infinite",
    },
  } as const;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.content}>
          <div style={styles.header}>
            <Dialog.Title style={styles.title}>
              {user ? "Edit User" : "Add New User"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button style={styles.closeBtn} aria-label="Close dialog">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                placeholder="Enter full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <span style={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="Enter email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span style={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                style={styles.input}
                placeholder="Enter phone number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+]?[\d\s-()]+$/,
                    message: "Invalid phone number",
                  },
                })}
              />
              {errors.phone && (
                <span style={styles.error}>{errors.phone.message}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company</label>
              <input
                style={styles.input}
                placeholder="Enter company name"
                {...register("company", {
                  required: "Company name is required",
                  minLength: {
                    value: 2,
                    message: "Company name must be at least 2 characters",
                  },
                })}
              />
              {errors.company && (
                <span style={styles.error}>{errors.company.message}</span>
              )}
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.cancel}
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button type="submit" style={styles.submit} disabled={isLoading}>
                {isLoading ? (
                  <div style={styles.loadingSmall} />
                ) : user ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
