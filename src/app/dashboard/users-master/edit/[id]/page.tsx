"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft } from "lucide-react";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { users, updateUser, deleteUser } = useAppData();
  const user = users.find(u => u.id === id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    userType: "",
    status: "Active"
  });

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser(id, formData);
    router.push("/dashboard/users-master");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      router.push("/dashboard/users-master");
    }
  };

  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit User</h1>
          <p className="text-sm text-gray-500 mt-1">Update system user details</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">First Name<span className="text-red-500">*</span></label>
            <input name="firstName" value={formData.firstName || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter First Name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Last Name<span className="text-red-500">*</span></label>
            <input name="lastName" value={formData.lastName || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Last Name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
            <input name="email" value={formData.email || ""} onChange={handleChange} type="email" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password<span className="text-red-500">*</span></label>
            <input name="password" value={formData.password || ""} onChange={handleChange} type="password" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Password (leave blank to keep current)" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" placeholder="Enter Phone" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">User Type<span className="text-red-500">*</span></label>
            <Select 
              name="userType" 
              value={formData.userType || ""} 
              onChange={handleChange as any} 
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
              value={formData.status || "Active"} 
              onChange={handleChange as any} 
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ]} 
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleDelete}>Delete User</Button>
          <div className="flex gap-4">
            <Button variant="secondary" className="bg-gray-50 hover:bg-gray-100" onClick={() => router.back()}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
