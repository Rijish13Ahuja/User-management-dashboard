"use client";

import React, { useEffect, useState } from "react";
import { useActivityLogStore } from "@/stores/activityLogStore";
import { useThemeStore } from "@/stores/themeStore";
import { Clock, UserPlus, UserMinus, UserCog } from "lucide-react";
import type { ActivityLog as ActivityLogEntry } from "@/types/user";

export const ActivityLog = () => {
  const { logs, clearLogs, administrator } = useActivityLogStore();
  const [mounted, setMounted] = useState(false);
  const [clearHover, setClearHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const { isDarkMode } = useThemeStore();

  const styles = {
    container: {
      background: isDarkMode
        ? "linear-gradient(180deg, rgba(7,17,41,0.85), rgba(6,10,25,0.9))"
        : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.95))",
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.04)"
        : "1px solid rgba(15,23,42,0.06)",
      borderRadius: 12,
      padding: 14,
      boxShadow: isDarkMode
        ? "0 6px 18px rgba(2,6,23,0.36)"
        : "0 6px 18px rgba(2,6,23,0.08)",
      width: "100%",
      boxSizing: "border-box" as const,
      transition: "transform 220ms ease, box-shadow 220ms ease",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    title: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700,
      color: isDarkMode ? "#e6eef8" : "#0f172a",
      letterSpacing: -0.2,
    },
    clearButton: (hover: boolean) => ({
      background: hover
        ? isDarkMode
          ? "linear-gradient(90deg,#0b1220,#071129)"
          : "linear-gradient(90deg,#fffbeb,#fff7f0)"
        : "transparent",
      border: "none",
      color: isDarkMode ? "#94a3b8" : "#6b7280",
      padding: "6px 10px",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 13,
      transition:
        "transform 150ms ease, box-shadow 150ms ease, color 150ms ease",
      transform: hover ? "translateY(-1px)" : "none",
      boxShadow: hover
        ? isDarkMode
          ? "0 10px 30px rgba(2,6,23,0.6)"
          : "0 6px 18px rgba(15,23,42,0.06)"
        : "none",
    }),
    content: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 8,
      minHeight: 60,
    },
    empty: {
      color: isDarkMode ? "#94a3b8" : "#6b7280",
      fontSize: 13,
      padding: "18px 6px",
      textAlign: "center" as const,
    },
    item: (index: number) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "10px 8px",
      borderRadius: 10,
      background: isDarkMode
        ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))"
        : "rgba(255,255,255,0.6)",
      transition:
        "transform 360ms cubic-bezier(.2,.9,.3,1), opacity 360ms ease",
      transform: mounted ? "translateX(0)" : "translateX(-8px)",
      opacity: mounted ? 1 : 0,
      transitionDelay: `${index * 45}ms`,
      alignSelf: "stretch",
    }),
    iconWrap: {
      minWidth: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      background: isDarkMode
        ? "linear-gradient(180deg,#071129,#021027)"
        : "linear-gradient(180deg,#f8fafc,#ffffff)",
      boxShadow: isDarkMode
        ? "inset 0 -2px 6px rgba(255,255,255,0.02)"
        : "inset 0 -2px 6px rgba(2,6,23,0.03)",
    },
    details: {
      flex: 1,
      minWidth: 0,
    },
    text: {
      margin: 0,
      fontSize: 14,
      color: isDarkMode ? "#e6eef8" : "#0f172a",
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "block",
      marginBottom: 4,
    },
    user: {
      fontWeight: 700,
      color: isDarkMode ? "#f8fafc" : "#0b1220",
      marginRight: 6,
    },
    timestamp: {
      margin: 0,
      fontSize: 12,
      color: isDarkMode ? "#94a3b8" : "#6b7280",
    },
  } as const;

  const getActionIcon = (action: ActivityLogEntry["action"]) => {
    switch (action) {
      case "CREATE":
        return <UserPlus size={18} color="#059669" />; 
      case "UPDATE":
        return <UserCog size={18} color="#d97706" />; 
      case "DELETE":
        return <UserMinus size={18} color="#dc2626" />; 
      default:
        return <Clock size={18} color="#6b7280" />; 
    }
  };

  const getActionText = (action: ActivityLogEntry["action"]) => {
    switch (action) {
      case "CREATE":
        return `${administrator} created this user`;
      case "UPDATE":
        return `${administrator} edited this user`;
      case "DELETE":
        return `${administrator} deleted this user`;
      default:
        return `${administrator} performed action on user`;
    }
  };

  return (
    <div style={styles.container} role="region" aria-label="Activity Log">
      <div style={styles.header}>
        <h2 style={styles.title}>Activity Log</h2>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            onMouseEnter={() => setClearHover(true)}
            onMouseLeave={() => setClearHover(false)}
            onFocus={() => setClearHover(true)}
            onBlur={() => setClearHover(false)}
            style={styles.clearButton(clearHover)}
            aria-label="Clear activity logs"
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      <div style={styles.content}>
        {logs.length === 0 ? (
          <p style={styles.empty}>No activity yet</p>
        ) : (
          logs.map((log, idx) => (
            <div key={log.id} style={styles.item(idx)}>
              <div style={styles.iconWrap}>{getActionIcon(log.action)}</div>
              <div style={styles.details}>
                <p style={styles.text}>
                  {getActionText(log.action)}
                </p>
                <p style={styles.timestamp}>{log.timestamp.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
