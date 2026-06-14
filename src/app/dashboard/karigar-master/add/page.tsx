"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft } from "lucide-react";

export default function AddKarigarPage() {
  const router = useRouter();
  const { addKarigar } = useAppData();
  const [formData, setFormData] = useState({
    karigarName: "",
    karigarCode: "",
    mobileNo: "",
    status: "Active"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    addKarigar(formData);
    router.push("/dashboard/karigar-master");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Karigar</h1>
          <p className="text-sm text-gray-500 mt-1">Register a new karigar profile</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Karigar Name <span className="text-red-500">*</span></label>
            <input name="karigarName" value={formData.karigarName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter karigar name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Karigar Code</label>
            <input name="karigarCode" value={formData.karigarCode} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter code" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mobile No <span className="text-red-500">*</span></label>
            <input name="mobileNo" value={formData.mobileNo} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter mobile number" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select 
              name="status" 
              value={formData.status} 
              onChange={handleChange as any} 
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ]} 
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Karigar</Button>
        </div>
      </div>
    </div>
  );
}
