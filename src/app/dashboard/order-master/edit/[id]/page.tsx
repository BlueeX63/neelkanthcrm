"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft, XCircle } from "lucide-react";

export default function EditOrderPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { orders, updateOrder, deleteOrder, customers, items } = useAppData();
  const order = orders.find(o => o.id === id);

  const [formData, setFormData] = useState({
    deliveryDate: "",
    customerId: "",
    productId: "",
    colorCode: "Yellow",
    status: "Order Confirmed",
    gWt: "",
    lWt: "",
    nWt: "",
    purity: "",
    pcs: "",
    size: "",
    height: "",
    width: "",
    orderDescription: ""
  });

  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...files];
      newFiles[index] = e.target.files[0];
      setFiles(newFiles);
    }
  };

  const handleDeleteImage = (index: number) => {
    // Clear new file if any
    if (files[index]) {
      const newFiles = [...files];
      newFiles[index] = null;
      setFiles(newFiles);
    }

    // Clear existing photo from form data
    const photoKey = `photo_${index + 1}`;
    setFormData(prev => ({ ...prev, [photoKey]: null }));
  };

  useEffect(() => {
    if (order) {
      setFormData(prev => ({ ...prev, ...order }));
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    updateOrder(id, { ...formData, files });
    router.push("/dashboard/order-master");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id);
      router.push("/dashboard/order-master");
    }
  };

  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Order</h1>
          <p className="text-sm text-gray-500 mt-1">Update order details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 space-y-2">
          <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">Order No:</span> <span className="text-gray-600">0005223</span></div>
          <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">Order Date:</span> <span className="text-gray-600">14-06-2026</span></div>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 space-y-2">
          <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">Add By:</span> <span className="text-gray-600">ROHIT KHATRI</span></div>
          <div className="flex justify-between text-sm"><span className="font-semibold text-gray-700">Add Time:</span> <span className="text-gray-600">08:43:43 pm</span></div>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Delivery Date:</span>
            <input name="deliveryDate" value={formData.deliveryDate || ""} onChange={handleChange} type="date" className="border border-gray-300 rounded-sm px-2 py-1 text-gray-700 focus:outline-none focus:border-black" />
          </div>
          <div className="flex justify-between text-sm pt-1"><span className="font-semibold text-gray-700">Delivery Days:</span> <span className="text-gray-600">10 Days</span></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Select Customer <span className="text-red-500">*</span></label>
            <Select
              name="customerId"
              value={formData.customerId}
              onChange={(v) => handleSelectChange("customerId", v)}
              placeholder="-- Select Customer --"
              searchable
              options={customers.map(c => ({ value: c.id, label: c.customerName, searchKeywords: c.mobileNo }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Select Product <span className="text-red-500">*</span></label>
            <Select
              name="productId"
              value={formData.productId}
              onChange={(v) => handleSelectChange("productId", v)}
              placeholder="-- Select Product --"
              searchable
              options={items.map(i => ({ value: i.id, label: i.itemName }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Select Color Code <span className="text-red-500">*</span></label>
            <Select
              name="colorCode"
              value={formData.colorCode || "Yellow"}
              onChange={(v) => handleSelectChange("colorCode", v)}
              options={[
                { value: "Yellow", label: "Yellow" },
                { value: "White", label: "White" },
                { value: "Rose", label: "Rose" },
                { value: "Platinum", label: "Platinum" },
                { value: "Dual Tone", label: "Dual Tone" }
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
            <Select
              name="status"
              value={formData.status}
              onChange={(v) => handleSelectChange("status", v)}
              options={[
                { value: "Order Confirmed", label: "Order Confirmed" },
                { value: "Assigned Karigar", label: "Assigned Karigar" },
                { value: "Received from Karigar", label: "Received from Karigar" },
                { value: "Delivered", label: "Delivered" },
                { value: "Cancelled", label: "Cancelled" }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { key: 'gWt', label: 'G.Wt' },
            { key: 'lWt', label: 'L.Wt' },
            { key: 'nWt', label: 'N.Wt' },
            { key: 'purity', label: 'Purity' },
            { key: 'pcs', label: 'Pcs' },
            { key: 'size', label: 'Size' },
            { key: 'height', label: 'Height' },
            { key: 'width', label: 'Width' }
          ].map(field => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              <input name={field.key} value={(formData as any)[field.key] || ""} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Order Description</label>
          <textarea name="orderDescription" value={formData.orderDescription || ""} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(index => {
            const photoKey = `photo_${index + 1}`;
            const existingPhoto = (formData as any)[photoKey];
            const currentFile = files[index];
            return (
              <div key={index} className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Upload Image {index + 1}</label>
                {existingPhoto && existingPhoto !== "-" && !currentFile && (
                  <div className="mb-2 relative group">
                    <img src={existingPhoto} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded-md border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                      title="Remove Image"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {currentFile && (
                  <div className="mb-2 relative group">
                    <img
                      src={URL.createObjectURL(currentFile)}
                      alt={`New Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                      title="Remove Selected File"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="relative mt-2">
                  <input
                    type="file"
                    id={`file-upload-${index}`}
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`file-upload-${index}`}
                    className="block w-full text-center text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md py-2 px-4 cursor-pointer transition-colors shadow-sm"
                  >
                    {(existingPhoto && existingPhoto !== "-") || currentFile ? "Change Image" : "Choose File"}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleDelete}>Delete Order</Button>
        <div className="flex gap-4">
          <Button variant="primary" className="bg-gray-200 text-black hover:bg-gray-300 border-gray-200" onClick={() => router.back()}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
