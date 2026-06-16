"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft } from "lucide-react";

export default function AddUserPage() {
  const router = useRouter();
  const { addUser } = useAppData();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    userType: "",
    status: "Active"
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setError(null);
    if (!formData.password || formData.password.length < 8) {
      setError("Password format is not correct. It must be at least 8 characters long.");
      return;
    }
    
    setIsLoading(true);
    try {
      await addUser(formData);
      router.push("/dashboard/users-master");
    } catch (err: any) {
      setError(err.message || "Failed to create user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add User</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new system user</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">First Name<span className="text-red-500">*</span></label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter First Name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Last Name<span className="text-red-500">*</span></label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Last Name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password<span className="text-red-500">*</span></label>
            <input name="password" value={formData.password} onChange={handleChange} type="password" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Password" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
            <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Phone" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">User Type<span className="text-red-500">*</span></label>
            <Select 
              name="userType" 
              value={formData.userType} 
              onChange={(v) => setFormData({ ...formData, userType: v })} 
              placeholder="Select Role"
              options={[
                { value: "ORDER DEPARTMENT", label: "ORDER DEPARTMENT" },
                { value: "ADMINISTRATOR", label: "ADMINISTRATOR" }
              ]} 
            />
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-medium animate-in fade-in duration-200 mt-6">
            {error}
          </div>
        )}

        <div className="flex justify-start gap-4 mt-8">
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button variant="secondary" className="bg-gray-50 hover:bg-gray-100" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
