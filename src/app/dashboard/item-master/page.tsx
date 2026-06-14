"use client";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";

const columns = [
  { key: "id", label: "#", sortable: true },
  { key: "itemName", label: "Item Name", sortable: true },
  { key: "shortName", label: "Item Short Name", sortable: true },
  { key: "groupName", label: "Item Group Name", sortable: true },
  { key: "touch", label: "Touch", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "addedBy", label: "Add By", sortable: true },
  { key: "date", label: "Add Date Time", sortable: true },
  { key: "action", label: "Action" },
];

export default function ItemMasterPage() {
  const { items } = useAppData();

  const enrichedItems = items.map(item => ({
    ...item,
    groupName: item.groupName || item.groupType || "-"
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-end">
        <Link href="/dashboard/item-master/add">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={enrichedItems} 
        searchPlaceholder="Search Items..."
        editPath="/dashboard/item-master/edit"
      />
    </div>
  );
}
