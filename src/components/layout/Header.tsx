"use client";

import * as Avatar from "@radix-ui/react-avatar";
import { Switch } from "@radix-ui/react-switch";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { Moon, Sun } from "lucide-react";
import React, { useState } from "react";

export const Header = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { currentUser } = useAuthStore();
  const [avatarHover, setAvatarHover] = useState(false);

  const getInitials = (name: string) => {
    return (name || "")
      .split(" ")
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const palette = {
    bg: isDarkMode
      ? "linear-gradient(90deg,#071129,#0b1220)"
      : "linear-gradient(90deg,#ffffff,#f8fafc)",
    text: isDarkMode ? "#e6eef8" : "#071129",
    muted: isDarkMode ? "#94a3b8" : "#6b7280",
    accent: "#2563eb",
    subtle: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(2,6,23,0.04)",
  };

  const styles = {
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "18px 20px",
      background: palette.bg,
      color: palette.text,
      borderBottom: `1px solid ${palette.subtle}`,
      boxShadow: isDarkMode
        ? "0 6px 24px rgba(2,6,23,0.6)"
        : "0 8px 30px rgba(2,6,23,0.06)",
      backdropFilter: "saturate(140%) blur(6px)",
    },
    container: {
      width: "100%",
      maxWidth: 1200,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      boxSizing: "border-box" as const,
    },
    logo: {
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: -0.4,
      background: `linear-gradient(90deg, ${palette.accent}, #7c3aed)`,
      WebkitBackgroundClip: "text" as const,
      backgroundClip: "text" as const,
      color: "transparent",
      transform: "translateY(0)",
      transition: "transform 260ms cubic-bezier(.2,.9,.3,1)",
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 18,
    },
    themeToggle: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px",
      borderRadius: 10,
      background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(2,6,23,0.02)",
    },
    themeIcon: {
      display: "block",
      opacity: 0.9,
    },
    switch: (checked: boolean) => ({
      width: 48,
      height: 26,
      borderRadius: 999,
      position: "relative" as const,
      background: checked
        ? "linear-gradient(90deg,#06b6d4,#2563eb)"
        : "rgba(15,23,42,0.12)",
      boxShadow: checked
        ? "0 6px 18px rgba(37,99,235,0.18)"
        : "inset 0 1px 0 rgba(255,255,255,0.02)",
      border: "none",
      padding: 3,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      transition: "all 220ms cubic-bezier(.2,.9,.3,1)",
    }),
    thumb: (checked: boolean) => ({
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: checked ? "#0b1220" : "#ffffff",
      transform: checked ? "translateX(20px)" : "translateX(0)",
      transition:
        "transform 220ms cubic-bezier(.2,.9,.3,1), background 220ms ease",
      boxShadow: "0 6px 12px rgba(2,6,23,0.08)",
    }),
    user: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "6px 8px",
      borderRadius: 12,
      cursor: "default",
      transition: "box-shadow 180ms ease, transform 160ms ease",
      boxShadow: avatarHover ? "0 12px 30px rgba(2,6,23,0.12)" : "none",
      transform: avatarHover ? "translateY(-2px)" : "none",
      background: isDarkMode
        ? "rgba(255,255,255,0.02)"
        : "rgba(255,255,255,0.6)",
    },
    avatarRoot: {
      width: 44,
      height: 44,
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "linear-gradient(180deg,#eef2ff,#e0f2fe)",
      color: "#0b1220",
      fontWeight: 700,
      fontSize: 14,
    },
    userDetails: {
      display: "flex",
      flexDirection: "column" as const,
      lineHeight: 1,
    },
    userName: {
      margin: 0,
      fontWeight: 700,
      color: palette.text,
      fontSize: 14,
    },
    userRole: {
      margin: 0,
      fontSize: 12,
      color: palette.muted,
    },
  } as const;

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo} aria-hidden>
          User Management Dashboard
        </div>

        <div style={styles.right}>
          <div style={styles.themeToggle} aria-hidden>
            <Sun
              size={16}
              color={isDarkMode ? "#fcd34d" : "#f59e0b"}
              style={styles.themeIcon}
            />
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              style={styles.switch(isDarkMode)}
              aria-label="Toggle theme"
            >
              <span style={styles.thumb(isDarkMode)} />
            </Switch>
            <Moon
              size={16}
              color={isDarkMode ? "#93c5fd" : "#64748b"}
              style={styles.themeIcon}
            />
          </div>

          <div
            style={styles.user}
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            title={currentUser?.name}
          >
            <Avatar.Root style={styles.avatarRoot}>
              <Avatar.Fallback style={{ fontWeight: 700, fontSize: 14 }}>
                {getInitials(currentUser?.name || "")}
              </Avatar.Fallback>
            </Avatar.Root>

            <div style={styles.userDetails}>
              <p style={styles.userName}>{currentUser?.name}</p>
              <p style={styles.userRole}>Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
