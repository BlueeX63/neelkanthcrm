"use client";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";

const columns = [
  { key: "id", label: "#", sortable: true },
  { key: "name", label: "User Name", sortable: true },
  { key: "email", label: "Email ID", sortable: true },
  { key: "role", label: "User Role", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action" },
];

export default function UsersMasterPage() {
  const { users } = useAppData();

  const enrichedUsers = users.map(user => ({
    ...user,
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "-",
    role: user.role || user.userType || "-"
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-end">
        <Link href="/dashboard/users-master/add">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={enrichedUsers} 
        searchPlaceholder="Search Users..."
        editPath="/dashboard/users-master/edit"
      />
    </div>
  );
}
