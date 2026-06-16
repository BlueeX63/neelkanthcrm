"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft } from "lucide-react";

export default function EditItemPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { items, updateItem, deleteItem } = useAppData();
  const item = items.find(i => i.id === id);

  const [formData, setFormData] = useState({
    itemName: "",
    shortName: "",
    groupType: "",
    touch: "",
    status: "Active"
  });

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateItem(id, formData);
    router.push("/dashboard/item-master");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
      router.push("/dashboard/item-master");
    }
  };

  if (!item) return <div className="p-6">Item not found</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Item</h1>
          <p className="text-sm text-gray-500 mt-1">Update item details</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Item Name <span className="text-red-500">*</span></label>
            <input name="itemName" value={formData.itemName || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Short Name</label>
            <input name="shortName" value={formData.shortName || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Group Type <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <Select 
                name="groupType" 
                value={formData.groupType || ""} 
                onChange={(v) => setFormData({ ...formData, groupType: v })} 
                className="flex-1"
                placeholder="-- Select Group Type --"
                options={[
                  { value: "ORNAMENTS", label: "ORNAMENTS" }
                ]} 
              />
              <button type="button" className="px-5 border border-blue-200 text-blue-600 rounded-sm text-sm hover:bg-blue-50 font-medium transition-colors cursor-pointer">
                + Add
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Touch</label>
            <input name="touch" value={formData.touch || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select 
              name="status" 
              value={formData.status || "Active"} 
              onChange={(v) => setFormData({ ...formData, status: v })} 
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ]} 
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleDelete}>Delete Item</Button>
          <div className="flex gap-4">
            <Button variant="secondary" className="bg-gray-50 hover:bg-gray-100" onClick={() => router.back()}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
