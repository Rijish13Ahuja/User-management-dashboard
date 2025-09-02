"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { UserTable } from "@/components/users/UserTable";
import { ActivityLog } from "@/components/layout/ActivityLog";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserTable
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          <aside className="lg:col-span-1">
            <ActivityLog />
          </aside>
        </div>
      </main>
    </div>
  );
}
