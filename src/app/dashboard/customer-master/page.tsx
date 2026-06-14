"use client";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";

const columns = [
  { key: "id", label: "#", sortable: true },
  { key: "customerName", label: "Customer Name", sortable: true },
  { key: "customerCode", label: "Customer Code", sortable: true },
  { key: "mobileNo", label: "Mobile No.", sortable: true },
  { key: "city", label: "City", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action" },
];

export default function CustomerMasterPage() {
  const { customers } = useAppData();

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-end">
        <Link href="/dashboard/customer-master/add">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={customers} 
        searchPlaceholder="Search Customers..."
        editPath="/dashboard/customer-master/edit"
      />
    </div>
  );
}
