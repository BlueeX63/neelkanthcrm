"use client";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";

const columns = [
  { key: "id", label: "#", sortable: true },
  { key: "karigarName", label: "Karigar Name", sortable: true },
  { key: "karigarCode", label: "Karigar Code", sortable: true },
  { key: "mobileNo", label: "Mobile No.", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action" },
];

export default function KarigarMasterPage() {
  const { karigars } = useAppData();

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-end">
        <Link href="/dashboard/karigar-master/add">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add Karigar
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={karigars} 
        searchPlaceholder="Search Karigars..."
        editPath="/dashboard/karigar-master/edit"
      />
    </div>
  );
}
