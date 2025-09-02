"use client";

import { useState, useMemo } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { UserForm } from "./UserForm";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { Search, Plus } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useRouter } from "next/navigation";

interface UserTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const UserTable = ({ currentPage, onPageChange }: UserTableProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { isDarkMode } = useThemeStore();

  const { users, allUsers, isLoading, deleteUser } = useUsers(currentPage);

  const { usersList, companies } = useMemo(() => {
    const usersList = (users || []) as User[];
    const allUsersList = (allUsers || []) as User[];
    const uniqueCompanies = Array.from(
      new Set(allUsersList.map((u) => u.company.name))
    );
    const companies = [
      { value: "all", label: "All Companies" },
      ...uniqueCompanies.map((c) => ({ value: c, label: c })),
    ];
    return { usersList, companies };
  }, [users, allUsers]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = usersList.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (companyFilter !== "all")
      filtered = filtered.filter((u) => u.company.name === companyFilter);

    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email)
    );
    return filtered;
  }, [usersList, searchTerm, companyFilter, sortOrder]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteUser(selectedUser.id);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleRowClick = (id: number) => router.push(`/users/${id}`);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading)
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

  const styles = {
    container: {
      width: "100%",
      background: isDarkMode
        ? "linear-gradient(180deg,#071129,#041025)"
        : "linear-gradient(180deg,#ffffff,#fbfdff)",
      borderRadius: 12,
      padding: 16,
      boxShadow: isDarkMode
        ? "0 12px 40px rgba(2,6,23,0.6)"
        : "0 10px 30px rgba(2,6,23,0.06)",
      boxSizing: "border-box" as const,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 14,
    },
    titleBlock: {},
    title: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    subtitle: {
      margin: 0,
      fontSize: 13,
      color: isDarkMode ? "#94a3b8" : "#6b7280",
      marginTop: 4,
    },
    controls: { display: "flex", gap: 10, alignItems: "center" },
    searchWrap: { display: "flex", alignItems: "center", gap: 8 },
    searchIcon: { color: isDarkMode ? "#94a3b8" : "#94a3b8" },
    input: {
      padding: "8px 10px",
      borderRadius: 10,
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.04)"
        : "1px solid rgba(15,23,42,0.06)",
      minWidth: 220,
      outline: "none",
      boxShadow: isDarkMode
        ? "inset 0 -1px 0 rgba(255,255,255,0.02)"
        : "inset 0 -1px 0 rgba(2,6,23,0.02)",
      background: isDarkMode ? "#071129" : "#fff",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    select: {
      padding: "8px 10px",
      borderRadius: 10,
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.04)"
        : "1px solid rgba(15,23,42,0.06)",
      background: isDarkMode ? "#071129" : "#fff",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    actionControls: { display: "flex", gap: 8, alignItems: "center" },
    button: (variant = "primary") => ({
      padding: "8px 12px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      background:
        variant === "secondary"
          ? isDarkMode
            ? "#0b1220"
            : "#f3f4f6"
          : variant === "danger"
          ? "#ef4444"
          : "#2563eb",
      color:
        variant === "secondary" ? (isDarkMode ? "#e6eef8" : "#0f172a") : "#fff",
      boxShadow:
        variant === "secondary"
          ? "none"
          : isDarkMode
          ? "0 12px 30px rgba(2,6,23,0.5)"
          : "0 8px 20px rgba(37,99,235,0.12)",
    }),
    addButton: {
      padding: "8px 12px",
      display: "inline-flex",
      gap: 8,
      alignItems: "center",
    },
    tableWrapper: {
      overflow: "auto",
      borderRadius: 10,
      border: isDarkMode
        ? "1px solid rgba(255,255,255,0.03)"
        : "1px solid rgba(15,23,42,0.04)",
      background: isDarkMode ? "rgba(255,255,255,0.02)" : "transparent",
    },
    table: { width: "100%", borderCollapse: "collapse" as const },
    th: {
      textAlign: "left",
      padding: "12px 14px",
      fontSize: 13,
      color: isDarkMode ? "#94a3b8" : "#6b7280",
    },
    td: {
      padding: "12px 14px",
      borderTop: isDarkMode
        ? "1px solid rgba(255,255,255,0.02)"
        : "1px solid rgba(15,23,42,0.03)",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
    },
    row: { cursor: "pointer" },
    userCell: { display: "flex", gap: 12, alignItems: "center" },
    avatarSmall: {
      width: 42,
      height: 42,
      borderRadius: 8,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDarkMode
        ? "linear-gradient(180deg,#07203a,#021027)"
        : "linear-gradient(180deg,#eef2ff,#e0f2fe)",
      color: isDarkMode ? "#e6eef8" : "#0b1220",
      fontWeight: 700,
    },
    nameSmall: { fontWeight: 700, color: isDarkMode ? "#e6eef8" : "#0b1220" },
    usernameSmall: { color: isDarkMode ? "#94a3b8" : "#6b7280", fontSize: 13 },
    actionsCell: { display: "flex", gap: 8 },
    empty: {
      padding: 20,
      textAlign: "center",
      color: isDarkMode ? "#94a3b8" : "#6b7280",
    },
    pagination: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    },
  } as const;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleBlock}>
          <h2 style={styles.title}>Users</h2>
          <p style={styles.subtitle}>
            Manage users — search, filter, add, edit or delete
          </p>
        </div>

        <div style={styles.controls}>
          <div style={styles.searchWrap}>
            <Search size={18} color="#94a3b8" />
            <input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
          </div>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            style={styles.select}
          >
            {companies.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <div style={styles.actionControls}>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              style={styles.button("secondary")}
              type="button"
            >
              {sortOrder === "asc" ? "Email A–Z" : "Email Z–A"}
            </button>

            <button
              onClick={() => setIsFormOpen(true)}
              style={{ ...styles.button("primary"), ...styles.addButton }}
            >
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr
                key={user.id}
                style={{ ...styles.row }}
                onClick={() => handleRowClick(user.id)}
              >
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <Avatar.Root style={styles.avatarSmall}>
                      <Avatar.Fallback>
                        {getInitials(user.name)}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <div style={styles.nameSmall}>{user.name}</div>
                      <div style={styles.usernameSmall}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.phone}</td>
                <td style={styles.td}>{user.company.name}</td>
                <td style={styles.td}>
                  <div style={styles.actionsCell}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(user);
                      }}
                      style={styles.button("secondary")}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user);
                      }}
                      style={styles.button("danger")}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedUsers.length === 0 && (
          <div style={styles.empty}>
            <p>
              No users found.{" "}
              {searchTerm || companyFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Add a new user to get started."}
            </p>
          </div>
        )}
      </div>

      <div style={styles.pagination}>
        <div>
          Showing <strong>{filteredAndSortedUsers.length}</strong> of{" "}
          <strong>{allUsers.length}</strong> users
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={styles.button("secondary")}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={filteredAndSortedUsers.length < 5}
            onClick={() => onPageChange(currentPage + 1)}
            style={styles.button("secondary")}
            type="button"
          >
            Next
          </button>
        </div>
      </div>

      <UserForm
        open={isFormOpen}
        user={editingUser}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
      <DeleteConfirmation
        open={isDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};
