"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import * as Avatar from "@radix-ui/react-avatar";
import { usersService } from "@/services/usersService";
import { ArrowLeft, Mail, Phone, Building, MapPin } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import Link from "next/link";

export default function UserDetailPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersService.getUserById(userId),
    enabled: !!userId,
  });

  const { isDarkMode } = useThemeStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: 28,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            border: "4px solid rgba(37,99,235,0.12)",
            borderTopColor: "#2563eb",
            animation: "spin 900ms linear infinite",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 28, display: "flex", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 20, margin: 0, color: "#0b1220" }}>
            User Not Found
          </h1>
          <Link href="/">
            <button
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(15,23,42,0.06)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const styles = {
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: 18,
      background: isDarkMode
        ? "linear-gradient(180deg,#071129,#041025)"
        : "linear-gradient(180deg,#f8fafc,#fbfdff)",
      minHeight: "100vh",
    },
    content: { width: "100%", maxWidth: 920 },
    backBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 10,
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(15,23,42,0.06)",
      background: isDarkMode ? "#0b1220" : "#fff",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
      cursor: "pointer",
      marginBottom: 18,
    },
    card: {
      background: isDarkMode
        ? "linear-gradient(180deg,#071129,#041025)"
        : "linear-gradient(180deg,#ffffff,#fbfdff)",
      borderRadius: 12,
      padding: 18,
      boxShadow: isDarkMode
        ? "0 12px 40px rgba(2,6,23,0.6)"
        : "0 12px 36px rgba(2,6,23,0.06)",
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.04)"
        : "1px solid rgba(15,23,42,0.04)",
    },
    profileHeader: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 12,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 14,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDarkMode
        ? "linear-gradient(180deg,#07203a,#021027)"
        : "linear-gradient(180deg,#eef2ff,#e0f2fe)",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
      fontWeight: 800,
      fontSize: 20,
    },
    profileTitle: {
      margin: 0,
      fontSize: 20,
      fontWeight: 800,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    profileUsername: { margin: 0, color: isDarkMode ? "#94a3b8" : "#64748b" },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18,
      marginTop: 12,
    },
    sectionTitle: {
      margin: 0,
      fontSize: 15,
      fontWeight: 800,
      marginBottom: 8,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    detailItem: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      marginBottom: 10,
    },
    icon: {
      minWidth: 20,
      marginTop: 4,
      color: isDarkMode ? "#60a5fa" : "#2563eb",
    },
    detailContent: {},
    detailLabel: {
      margin: 0,
      fontSize: 13,
      color: isDarkMode ? "#94a3b8" : "#6b7280",
    },
    detailValue: {
      margin: 0,
      fontSize: 14,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
      fontWeight: 700,
    },
    additional: { marginTop: 16 },
    link: {
      color: isDarkMode ? "#60a5fa" : "#2563eb",
      textDecoration: "underline",
    },
  } as const;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Link href="/">
          <button style={styles.backBtn}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </Link>

        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              <Avatar.Root>
                <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
              </Avatar.Root>
            </div>

            <div>
              <h1 style={styles.profileTitle}>{user.name}</h1>
              <p style={styles.profileUsername}>@{user.username}</p>
            </div>
          </div>

          <div style={styles.detailsGrid}>
            <div>
              <h2 style={styles.sectionTitle}>Contact Information</h2>

              <div style={styles.detailItem}>
                <Mail size={18} style={styles.icon} />
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Email</p>
                  <p style={styles.detailValue}>{user.email}</p>
                </div>
              </div>

              <div style={styles.detailItem}>
                <Phone size={18} style={styles.icon} />
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Phone</p>
                  <p style={styles.detailValue}>{user.phone}</p>
                </div>
              </div>

              <div style={styles.detailItem}>
                <Building size={18} style={styles.icon} />
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Company</p>
                  <p style={styles.detailValue}>{user.company.name}</p>
                  <p style={styles.detailLabel}>{user.company.catchPhrase}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 style={styles.sectionTitle}>Address</h2>

              <div style={styles.detailItem}>
                <MapPin size={18} style={styles.icon} />
                <div style={styles.detailContent}>
                  <p style={styles.detailValue}>{user.address.street}</p>
                  <p style={styles.detailValue}>
                    {user.address.city}, {user.address.zipcode}
                  </p>
                  <p style={styles.detailLabel}>
                    Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.additional}>
            <h2 style={styles.sectionTitle}>Additional Information</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <p style={styles.detailLabel}>Website</p>
                <a
                  style={styles.link}
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              </div>

              <div>
                <p style={styles.detailLabel}>Business</p>
                <p style={styles.detailValue}>{user.company.bs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
