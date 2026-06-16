"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft } from "lucide-react";

export default function AddItemPage() {
  const router = useRouter();
  const { addItem } = useAppData();
  const [formData, setFormData] = useState({
    itemName: "",
    shortName: "",
    groupType: "",
    touch: "",
    status: "Active"
  });
  const [isCustomGroupType, setIsCustomGroupType] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    addItem(formData);
    router.push("/dashboard/item-master");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Item</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new item in the master list</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Item Name <span className="text-red-500">*</span></label>
            <input name="itemName" value={formData.itemName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Short Name</label>
            <input name="shortName" value={formData.shortName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Group Type <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {isCustomGroupType ? (
                <input 
                  type="text" 
                  name="groupType" 
                  value={formData.groupType} 
                  onChange={handleChange} 
                  placeholder="Enter new group type..."
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black shadow-sm" 
                  autoFocus
                />
              ) : (
                <Select 
                  name="groupType" 
                  value={formData.groupType} 
                  onChange={(v) => setFormData({ ...formData, groupType: v })} 
                  className="flex-1"
                  placeholder="-- Select Group Type --"
                  options={[
                    { value: "ORNAMENTS", label: "ORNAMENTS" }
                  ]} 
                />
              )}
              <button 
                type="button" 
                onClick={() => {
                  setIsCustomGroupType(!isCustomGroupType);
                  setFormData({ ...formData, groupType: "" });
                }}
                className={`px-5 border rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  isCustomGroupType 
                    ? "border-red-200 text-red-600 hover:bg-red-50" 
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {isCustomGroupType ? "Cancel" : "+ Add"}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Touch</label>
            <input name="touch" value={formData.touch} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select 
              name="status" 
              value={formData.status} 
              onChange={(v) => setFormData({ ...formData, status: v })} 
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ]} 
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button variant="primary" onClick={handleSave}>Save</Button>
          <Button variant="secondary" className="bg-gray-50 hover:bg-gray-100" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
