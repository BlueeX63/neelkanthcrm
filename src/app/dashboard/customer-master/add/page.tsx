"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft } from "lucide-react";

export default function AddCustomerPage() {
  const router = useRouter();
  const { addCustomer } = useAppData();
  const [formData, setFormData] = useState({
    customerName: "",
    customerCode: "",
    mobileNo: "",
    address: "",
    city: "",
    gstNo: "",
    status: "Active"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    addCustomer(formData);
    router.push("/dashboard/customer-master");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Customer</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new customer profile</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Customer Name <span className="text-red-500">*</span></label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Customer Name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Customer Code</label>
            <input name="customerCode" value={formData.customerCode} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Customer Code" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mobile No <span className="text-red-500">*</span></label>
            <input name="mobileNo" value={formData.mobileNo} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Mobile No" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Address" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">City</label>
            <input name="city" value={formData.city} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter City" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">GST No</label>
            <input name="gstNo" value={formData.gstNo} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter GST No" />
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
          <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
