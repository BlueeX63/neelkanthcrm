"use client";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Filter, FileText, Home, Users, UserCog, Package, ShoppingCart, XCircle, CheckCircle, Truck, ClipboardList, SlidersHorizontal, Download, FileSpreadsheet } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useState } from "react";
import Select from "@/components/ui/Select";
import { motion, AnimatePresence } from "framer-motion";
import { downloadCSV, downloadExcel } from "@/utils/exportUtils";

const columns = [
  { key: "orderNo", label: "Order No", sortable: true },
  { key: "date", label: "Order Date", sortable: true },
  { key: "name", label: "Customer Name", sortable: true },
  { key: "itemName", label: "Item Name", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "cad", label: "CAD", sortable: true },
  { key: "casting", label: "Casting", sortable: true },
  { key: "filling", label: "Filling", sortable: true },
  { key: "stone", label: "Stone", sortable: true },
  { key: "polish", label: "Polish", sortable: true },
  { key: "photo", label: "Photo", sortable: false },
  { key: "action", label: "Action" },
];

export default function OrderMasterPage() {
  const { orders, customers, items } = useAppData();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", customerName: "", status: "" });
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);

  const enrichedOrders = orders.map(order => {
    let finalName = order.name;
    if ((!finalName || finalName === "-") && order.customerId) {
      const customer = customers.find(c => c.id === order.customerId);
      finalName = customer?.customerName || "-";
    }
    
    let finalItemName = order.itemName;
    if ((!finalItemName || finalItemName === "-") && order.productId) {
      const item = items.find(i => i.id === order.productId);
      finalItemName = item?.itemName || "-";
    }
    
    return { ...order, name: finalName, itemName: finalItemName };
  });

  const filteredOrders = enrichedOrders.filter(order => {
    let match = true;
    if (filters.status && order.status !== filters.status) match = false;
    if (filters.customerName && order.name !== filters.customerName) match = false;
    // Basic date filtering placeholder (assuming DD-MM-YYYY format in order.date)
    if (filters.dateFrom) {
      const dFrom = new Date(filters.dateFrom);
      const parts = order.date.split('-');
      if (parts.length === 3) {
        const oDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (oDate < dFrom) match = false;
      }
    }
    if (filters.dateTo) {
      const dTo = new Date(filters.dateTo);
      const parts = order.date.split('-');
      if (parts.length === 3) {
        const oDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (oDate > dTo) match = false;
      }
    }
    return match;
  });

  const handleExport = (format: 'csv' | 'excel') => {
    const exportData = filteredOrders.map(order => ({
      "Order No": order.orderNo || "-",
      "Date": order.date || "-",
      "Customer Name": order.name || "-",
      "Item Name": order.itemName || "-",
      "Color Code": order.colorCode || "-",
      "Status": order.status || "-",
      "Purity": order.purity || "-",
      "Gross Wt": order.gWt || "-",
      "Less Wt": order.lWt || "-",
      "Net Wt": order.nWt || "-",
      "Pieces": order.pcs || "-",
      "Size": order.size || "-",
      "Dimensions": (order.height && order.width) ? `${order.height} x ${order.width}` : "-",
      "Description": order.orderDescription || "-"
    }));
    
    if (format === 'csv') {
      downloadCSV(exportData, `orders_${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      downloadExcel(exportData, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" onClick={() => handleExport('excel')} className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
          <FileSpreadsheet className="w-4 h-4 mr-1.5" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={() => handleExport('csv')} className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200">
          <Download className="w-4 h-4 mr-1.5" />
          Export CSV
        </Button>
        <Link href="/dashboard/order-master/create">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Row 1 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "All Orders", statusFilter: "", value: orders.length, icon: ClipboardList, color: "text-gray-800" },
          { label: "Order Confirmed", statusFilter: "Order Confirmed", value: orders.filter(o => o.status === "Order Confirmed").length, icon: Users, color: "text-green-500" },
          { label: "Assigned Karigar", statusFilter: "Assigned Karigar", value: orders.filter(o => o.status === "Assigned Karigar").length, icon: UserCog, color: "text-indigo-500" },
          { label: "Received from Karigar", statusFilter: "Received from Karigar", value: orders.filter(o => o.status === "Received from Karigar").length, icon: Package, color: "text-sky-500" },
          { label: "Delivered", statusFilter: "Delivered", value: orders.filter(o => o.status === "Delivered").length, icon: Truck, color: "text-purple-500" },
          { label: "Cancelled", statusFilter: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length, icon: XCircle, color: "text-red-500" },
        ].map((stat, i) => {
          const isActive = filters.status === stat.statusFilter;
          const bgClass = isActive ? "bg-gray-50 border-gray-400 shadow-md ring-1 ring-gray-300" : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300";
          return (
          <div 
            key={i} 
            onClick={() => setFilters({...filters, status: stat.statusFilter})}
            className={`p-4 rounded-md border ${bgClass} flex items-center gap-4 cursor-pointer transition-all duration-200`}
          >
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={stat.color}
                  strokeWidth="2"
                  strokeDasharray={`${i === 0 ? 100 : i * 15}, 100`}
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium leading-tight">{stat.label}</div>
            </div>
          </div>
        );
        })}
      </div>

      {/* Advanced Filters Section */}
      <div className="relative z-50 rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="bg-black text-white px-5 py-3 text-sm font-semibold tracking-wide">
          Advanced Filters
        </div>
        <div className="p-4 flex justify-between items-center border-b border-gray-100 relative z-50">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Orders</h2>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`flex items-center justify-center gap-2 h-9 px-4 rounded-full border transition-all duration-300 outline-none cursor-pointer ${showFilters ? 'bg-black text-white border-black shadow-md hover:bg-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'}`}
          >
            <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium tracking-wide">Filters</span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onAnimationStart={() => setIsFilterAnimating(true)}
              onAnimationComplete={() => setIsFilterAnimating(false)}
              className={`relative z-50 ${isFilterAnimating ? 'overflow-hidden' : 'overflow-visible'}`}
            >
              <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-end gap-4">
            <div className="space-y-1.5 flex-1 w-full">
              <label className="text-xs font-bold text-gray-900">Date From</label>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-1.5 flex-1 w-full">
              <label className="text-xs font-bold text-gray-900">Date To</label>
              <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-1.5 flex-1 w-full">
              <label className="text-xs font-bold text-gray-900">Customer</label>
              <Select 
                value={filters.customerName} 
                onChange={v => setFilters({...filters, customerName: v})} 
                options={[{value: "", label: "-- All --"}, ...customers.map(c => ({value: c.customerName, label: c.customerName}))]} 
                placeholder="-- All --"
                searchable
              />
            </div>
            <div className="space-y-1.5 flex-1 w-full">
              <label className="text-xs font-bold text-gray-900">Status</label>
              <Select 
                value={filters.status} 
                onChange={v => setFilters({...filters, status: v})} 
                options={[
                  {value: "", label: "-- All --"},
                  {value: "Order Confirmed", label: "Order Confirmed"},
                  {value: "Assigned Karigar", label: "Assigned Karigar"},
                  {value: "Received from Karigar", label: "Received from Karigar"},
                  {value: "Delivered", label: "Delivered"},
                  {value: "Cancelled", label: "Cancelled"}
                ]}
                placeholder="-- All --"
              />
            </div>
                <div className="flex-none w-full md:w-auto">
                  <Button variant="primary" className="w-full md:w-auto bg-black hover:bg-[#6A4FE0] text-white px-8 rounded-full h-[38px] mb-0.5" onClick={() => {}}>Search</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Row 2 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { title: "GHAT", pcs: 0, wt: "0" },
          { title: "CAD", pcs: 120, wt: "710.849" },
          { title: "Casting", pcs: 49, wt: "347.470" },
          { title: "Filling", pcs: 3, wt: "135.500" },
          { title: "Stone Setting", pcs: 4, wt: "36.800" },
          { title: "POLISHED", pcs: 1, wt: "14.500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-md p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-gray-900">{stat.pcs === 0 ? "0" : stat.pcs}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase mt-0.5 truncate">{stat.title}</div>
              <div className="text-[10px] text-gray-500 mt-1 truncate">
                PCS: {stat.pcs} | Gross Wt: {stat.wt}
              </div>
            </div>
          </div>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredOrders} 
        searchPlaceholder="Search Orders..."
        editPath="/dashboard/order-master/edit"
        onDownload={(row) => {
          window.open(`/dashboard/order-master/print/${row.id}`, '_blank');
        }}
        getRowClass={(row) => {
          if (row.colorCode === 'Yellow') return 'bg-yellow-50 hover:bg-yellow-100';
          if (row.colorCode === 'White') return 'bg-slate-50 hover:bg-slate-100';
          if (row.colorCode === 'Rose') return 'bg-rose-50 hover:bg-rose-100';
          if (row.colorCode === 'Platinum') return 'bg-gray-100 hover:bg-gray-200';
          if (row.colorCode === 'Dual Tone') return 'bg-indigo-50 hover:bg-indigo-100';
          return 'bg-white hover:bg-gray-50/50';
        }}
      />
    </div>
  );
}
