"use client";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Filter, FileText, Home, Users, UserCog, Package, ShoppingCart, XCircle, CheckCircle, Truck, ClipboardList, SlidersHorizontal, Download, FileSpreadsheet, Pencil, Printer } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { motion, AnimatePresence } from "framer-motion";
import { downloadCSV, downloadExcel } from "@/utils/exportUtils";
import { AssignKarigarModal, ReceiveKarigarModal, DeliverModal, CancelConfirmModal, KarigarHistoryModal } from "@/components/modals/OrderActionModals";



export default function OrderMasterPage() {
  const { orders, customers, items, karigars, updateOrder } = useAppData();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({ 
    dateFrom: "", 
    dateTo: "", 
    customerName: "", 
    status: "",
    process: ""
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get('status');
      if (statusParam) {
        setFilters(f => ({ ...f, status: statusParam }));
      }
    }
  }, []);
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Modals state
  const [modalState, setModalState] = useState<{ type: 'assign' | 'receive' | 'deliver' | 'cancel' | 'history' | null, orderId?: string }>({ type: null });

  const enrichedOrders = orders.map(order => {
    let finalName = "-";
    if (order.customerId) {
      const customer = customers.find(c => c.id === order.customerId);
      finalName = customer?.customerName || "-";
    }
    if (finalName === "-" && order.name && order.name !== "-") {
      finalName = order.name;
    }

    let finalItemName = order.itemName;
    const item = items.find(i => i.id === order.productId);
    if ((!finalItemName || finalItemName === "-") && item) {
      finalItemName = item.itemName || "-";
    }

    const karigar = karigars.find(k => k.id === order.assignedKarigarId);
    const karigarName = karigar ? karigar.karigarName : "-";
    const touch = item ? item.touch : "-";

    let differenceDays = "-";
    if (order.receivingDate && order.karigarDeliveredDate) {
       const expected = new Date(order.receivingDate);
       const actual = new Date(order.karigarDeliveredDate);
       const diffTime = actual.getTime() - expected.getTime();
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       differenceDays = diffDays > 0 ? `${diffDays} days late` : diffDays < 0 ? `${Math.abs(diffDays)} days early` : "On time";
    }

    const getProcessDates = (processName: string, isYes: string) => {
       const pHist = order.history?.slice().sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).find((h: any) => h.process_name?.toLowerCase() === processName.toLowerCase());
       
       if (pHist) {
         const formatDate = (dateStr: string) => {
           if (!dateStr) return '';
           const d = new Date(dateStr);
           return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
         };
         
         const start = pHist.action_date ? formatDate(pHist.action_date) : 'Pending';
         const end = pHist.received_date ? formatDate(pHist.received_date) : 'Pending';
         
         return `${start} - ${end}`;
       }
       
       return isYes || "-";
    };

    return { 
      ...order, 
      name: finalName, 
      itemName: finalItemName,
      karigarName,
      touch,
      differenceDays,
      cad: getProcessDates('CAD', order.cad),
      designing: getProcessDates('Designing', order.designing),
      casting: getProcessDates('Casting', order.casting),
      filling: getProcessDates('Filing', order.filling),
      stone: getProcessDates('Stone Setting', order.stone),
      polish: getProcessDates('Polish', order.polish)
    };
  });

  const getColumns = () => {
    const baseActionRender = (row: any) => (
      <div className="flex items-center gap-2">
         <Link href={`/dashboard/order-master/edit/${row.id}`} className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Edit">
           <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
         </Link>
         <button onClick={() => window.open(`/dashboard/order-master/print/${row.id}`, '_blank')} className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Print Invoice">
           <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
         </button>
         <button onClick={() => window.open(`/dashboard/order-master/print/${row.id}`, '_blank')} className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Download PDF">
           <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
         </button>
         {(filters.status === "Assigned Karigar" || filters.status === "Received from Karigar" || filters.status === "Delivered") && (
           <button onClick={() => setModalState({ type: 'history', orderId: row.id })} className="inline-flex items-center justify-center p-2 rounded-md bg-gray-50 text-gray-500 hover:text-brand-600 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 transition-colors cursor-pointer group" title="Karigar History">
             <ClipboardList className="w-4 h-4 group-hover:scale-110 transition-transform" />
           </button>
         )}
      </div>
    );

    const actionColumn = { key: "action", label: "Action", render: baseActionRender };
    const photoColumn = { key: "photo", label: "Photo", sortable: false };

    switch(filters.status) {
      case "Order Confirmed":
        return [
          { key: "orderNo", label: "Order No", sortable: true },
          { key: "date", label: "Date", sortable: true },
          { key: "name", label: "Customer", sortable: true },
          { key: "deliveryDate", label: "Delivery Date", sortable: true },
          { key: "itemName", label: "Product", sortable: true },
          { key: "pcs", label: "Pcs", sortable: true },
          { key: "gWt", label: "GWT", sortable: true },
          { key: "touch", label: "Touch", sortable: true },
          { key: "addedBy", label: "Added By", sortable: true },
          photoColumn,
          { key: "status", label: "Status", sortable: true },
          actionColumn
        ];
      case "Assigned Karigar":
        return [
          { key: "orderNo", label: "Order No", sortable: true },
          { key: "date", label: "Date", sortable: true },
          { key: "name", label: "Customer", sortable: true },
          { key: "processName", label: "Process", sortable: true },
          { key: "karigarName", label: "Karigar", sortable: true },
          { key: "assignedDate", label: "Assign Date", sortable: true },
          { key: "receivingDate", label: "Est. Rcv Date", sortable: true },
          { key: "itemName", label: "Product", sortable: true },
          { key: "gWt", label: "GWT", sortable: true },
          { key: "addedBy", label: "Added By", sortable: true },
          photoColumn,
          { key: "status", label: "Status", sortable: true },
          actionColumn
        ];
      case "Received from Karigar":
        return [
          { key: "orderNo", label: "Order No", sortable: true },
          { key: "date", label: "Date", sortable: true },
          { key: "name", label: "Customer", sortable: true },
          { key: "processName", label: "Process", sortable: true },
          { key: "karigarName", label: "Karigar", sortable: true },
          { key: "assignedDate", label: "Assign Date", sortable: true },
          { key: "receivingDate", label: "Est. Rcv Date", sortable: true },
          { key: "karigarDeliveredDate", label: "Actual Rcv Date", sortable: true },
          { key: "differenceDays", label: "Diff Days", sortable: true },
          { key: "itemName", label: "Product", sortable: true },
          { key: "gWt", label: "GWT", sortable: true },
          { key: "addedBy", label: "Added By", sortable: true },
          photoColumn,
          { key: "status", label: "Status", sortable: true },
          actionColumn
        ];
      case "Delivered":
        return [
          { key: "orderNo", label: "Order No", sortable: true },
          { key: "date", label: "Date", sortable: true },
          { key: "name", label: "Customer", sortable: true },
          { key: "deliveryDate", label: "Delivery Date", sortable: true },
          { key: "deliveredDate", label: "Delivered Date", sortable: true },
          { key: "itemName", label: "Product", sortable: true },
          { key: "gWt", label: "GWT", sortable: true },
          { key: "addedBy", label: "Added By", sortable: true },
          photoColumn,
          { key: "status", label: "Status", sortable: true },
          actionColumn
        ];
      case "Cancelled":
        return [
          { key: "orderNo", label: "Order No", sortable: true },
          { key: "date", label: "Date", sortable: true },
          { key: "name", label: "Customer", sortable: true },
          { key: "cancelReason", label: "Cancel Reason", sortable: true },
          { key: "cancelDate", label: "Cancel Date", sortable: true },
          { key: "addedBy", label: "Added By", sortable: true },
          actionColumn
        ];
      default:
        return [
          { key: "orderNo", label: "Order No", sortable: true },
          { key: "date", label: "Date", sortable: true },
          { key: "name", label: "Customer", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "cad", label: "CAD", sortable: true },
          { key: "designing", label: "Designing", sortable: true },
          { key: "casting", label: "Casting", sortable: true },
          { key: "filling", label: "Filling", sortable: true },
          { key: "stone", label: "Stone", sortable: true },
          { key: "polish", label: "Polish", sortable: true },
          photoColumn
        ];
    }
  };

  const filteredOrders = enrichedOrders.filter(order => {
    let match = true;
    if (filters.status && order.status !== filters.status) match = false;
    if (filters.customerName && order.name !== filters.customerName) match = false;
    if (filters.process && order.processName?.toUpperCase() !== filters.process.toUpperCase()) match = false;
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

  const handleBulkAction = async (actionType: 'assign' | 'receive' | 'deliver' | 'cancel', data: any) => {
    let hasInvalid = false;
    for (const orderId of selectedOrders) {
      const order = orders.find(o => o.id === orderId);
      if (!order) continue;

      if (actionType === 'assign') {
        // Check if it's an initial assign or reassign
        if (order.status !== 'Order Confirmed' && order.status !== 'Assigned Karigar' && order.status !== 'Received from Karigar') {
          hasInvalid = true;
          continue;
        }
        await updateOrder(orderId, {
          status: 'Assigned Karigar',
          processName: data.processName,
          assignedKarigarId: data.karigarId,
          assignedDate: data.assignedDate,
          receivingDate: data.receivingDate
        });
      } else if (actionType === 'receive') {
        if (order.status !== 'Assigned Karigar') {
          hasInvalid = true;
          continue;
        }
        await updateOrder(orderId, {
          status: 'Received from Karigar',
          karigarDeliveredDate: data.karigarDeliveredDate
        });
      } else if (actionType === 'deliver') {
        if (order.status !== 'Received from Karigar') {
          hasInvalid = true;
          continue;
        }
        await updateOrder(orderId, {
          status: 'Delivered',
          deliveryDate: data.deliveryDate,
          deliveredDate: data.deliveredDate
        });
      } else if (actionType === 'cancel') {
        await updateOrder(orderId, {
          status: 'Cancelled',
          cancelReason: data.cancelReason,
          cancelDate: data.cancelDate
        });
      }
    }
    if (hasInvalid) {
      alert("Some orders were skipped because they did not have the correct status for this action.");
    }
    setSelectedOrders([]);
    setModalState({ type: null });
  };

  const getDynamicProcessStats = () => {
    const processes = [
      { name: "GHAT", color: "text-blue-500" },
      { name: "CAD", color: "text-purple-500" },
      { name: "Designing", color: "text-emerald-500" },
      { name: "Casting", color: "text-orange-500" },
      { name: "Filling", color: "text-red-500" },
      { name: "Stone Setting", color: "text-teal-500" },
      { name: "POLISHED", color: "text-pink-500" }
    ];
    return processes.map(process => {
      const processOrders = orders.filter(o => o.processName?.toUpperCase() === process.name.toUpperCase());
      const totalPcs = processOrders.reduce((sum, o) => sum + (Number(o.pcs) || 0), 0);
      const totalWt = processOrders.reduce((sum, o) => sum + (Number(o.gWt) || 0), 0);
      return {
        title: process.name.toUpperCase(),
        count: processOrders.length,
        pcs: totalPcs,
        wt: totalWt.toFixed(3),
        color: process.color
      };
    });
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
              onClick={() => {
                setFilters({ ...filters, status: stat.statusFilter });
                setSelectedOrders([]);
              }}
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

      {/* Row 2 Process Stats */}
      <div className="flex flex-wrap lg:flex-nowrap gap-2 w-full">
        {getDynamicProcessStats().map((stat, i) => (
          <div 
            key={i} 
            onClick={() => {
              setFilters({ ...filters, process: filters.process === stat.title ? "" : stat.title });
              setSelectedOrders([]);
            }}
            className={`flex-1 min-w-[120px] bg-white border ${filters.process === stat.title ? 'border-[#6A4FE0] ring-1 ring-[#6A4FE0]' : 'border-gray-200'} rounded-md p-2 flex items-start gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            <FileText className={`w-5 h-5 shrink-0 mt-1 ${stat.color || 'text-gray-400'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-gray-900">{stat.count}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase mt-0.5 truncate">{stat.title}</div>
              <div className="text-[9px] lg:text-[10px] text-gray-500 mt-1 truncate">
                PCS: {stat.pcs} | Gross Wt: {stat.wt}
              </div>
            </div>
          </div>
        ))}
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
                  <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5 flex-1 w-full">
                  <label className="text-xs font-bold text-gray-900">Date To</label>
                  <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5 flex-1 w-full">
                  <label className="text-xs font-bold text-gray-900">Customer</label>
                  <Select
                    value={filters.customerName}
                    onChange={v => setFilters({ ...filters, customerName: v })}
                    options={[{ value: "", label: "-- All --" }, ...customers.map(c => ({ value: c.customerName, label: c.customerName }))]}
                    placeholder="-- All --"
                    searchable
                  />
                </div>
                <div className="space-y-1.5 flex-1 w-full">
                  <label className="text-xs font-bold text-gray-900">Status</label>
                  <Select
                    value={filters.status}
                    onChange={v => {
                      setFilters({ ...filters, status: v });
                      setSelectedOrders([]);
                    }}
                    options={[
                      { value: "", label: "-- All --" },
                      { value: "Order Confirmed", label: "Order Confirmed" },
                      { value: "Assigned Karigar", label: "Assigned Karigar" },
                      { value: "Received from Karigar", label: "Received from Karigar" },
                      { value: "Delivered", label: "Delivered" },
                      { value: "Cancelled", label: "Cancelled" }
                    ]}
                    placeholder="-- All --"
                  />
                </div>
                <div className="flex-none w-full md:w-auto">
                  <Button variant="primary" className="w-full md:w-auto bg-black hover:bg-[#6A4FE0] text-white px-8 rounded-full h-[38px] mb-0.5" onClick={() => { }}>Search</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        {filters.status === "Order Confirmed" && (
          <>
            <Button variant="solid" onClick={() => setModalState({ type: 'assign' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-slate-900 hover:bg-slate-800">Assign to Karigar</Button>
            <Button variant="solid" onClick={() => setModalState({ type: 'cancel' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-red-600 hover:bg-red-700">Cancel Orders</Button>
          </>
        )}
        {filters.status === "Assigned Karigar" && (
          <>
            <Button variant="solid" onClick={() => setModalState({ type: 'receive' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-black hover:bg-gray-800">Receive from Karigar</Button>
            <Button variant="solid" onClick={() => setModalState({ type: 'cancel' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-red-600 hover:bg-red-700">Cancel Orders</Button>
            <Button variant="solid" onClick={() => setModalState({ type: 'assign' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-slate-700 hover:bg-slate-800">ReAssign Orders</Button>
          </>
        )}
        {filters.status === "Received from Karigar" && (
          <>
            <Button variant="solid" onClick={() => setModalState({ type: 'deliver' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-black hover:bg-gray-800">Deliver to Customer</Button>
            <Button variant="solid" onClick={() => setModalState({ type: 'cancel' })} disabled={selectedOrders.length === 0} className="text-sm h-10 px-4 bg-red-600 hover:bg-red-700">Cancel Orders</Button>
          </>
        )}
      </div>



      <DataTable
        columns={getColumns()}
        data={filteredOrders}
        searchPlaceholder="Search Orders..."
        editPath="/dashboard/order-master/edit"
        selectable={true}
        selectedRows={selectedOrders}
        onSelectionChange={setSelectedOrders}
        onDownload={(row) => {
          window.open(`/dashboard/order-master/print/${row.id}`, '_blank');
        }}
        getRowClass={(row) => {
          if (row.colorCode && row.colorCode !== "-") {
            if (row.colorCode === 'Yellow') return 'bg-yellow-50 hover:bg-yellow-100';
            if (row.colorCode === 'White') return 'bg-slate-50 hover:bg-slate-100';
            if (row.colorCode === 'Rose') return 'bg-rose-50 hover:bg-rose-100';
            if (row.colorCode === 'Platinum') return 'bg-gray-100 hover:bg-gray-200';
            if (row.colorCode === 'Dual Tone') return 'bg-indigo-50 hover:bg-indigo-100';
          }
          
          if (row.status === 'Cancelled') return 'bg-red-50 hover:bg-red-100';
          if (row.status === 'Order Confirmed') return 'bg-green-50 hover:bg-green-100';
          if (row.status === 'Delivered') return 'bg-slate-100 hover:bg-slate-200';
          if (row.status === 'Assigned Karigar') return 'bg-purple-50 hover:bg-purple-100';
          if (row.status === 'Received from Karigar') return 'bg-blue-50 hover:bg-blue-100';
          
          return 'bg-white hover:bg-gray-50/50';
        }}
      />

      <AssignKarigarModal
        isOpen={modalState.type === 'assign'}
        onClose={() => setModalState({ type: null })}
        onSubmit={(data) => handleBulkAction('assign', data)}
        selectedOrders={orders.filter(o => selectedOrders.includes(o.id))}
        karigars={karigars}
      />

      <ReceiveKarigarModal
        isOpen={modalState.type === 'receive'}
        onClose={() => setModalState({ type: null })}
        onSubmit={(data) => handleBulkAction('receive', data)}
        selectedOrders={orders.filter(o => selectedOrders.includes(o.id))}
        karigars={karigars}
      />

      <DeliverModal
        isOpen={modalState.type === 'deliver'}
        onClose={() => setModalState({ type: null })}
        onSubmit={(data) => handleBulkAction('deliver', data)}
        selectedOrders={orders.filter(o => selectedOrders.includes(o.id))}
      />

      <CancelConfirmModal
        isOpen={modalState.type === 'cancel'}
        onClose={() => setModalState({ type: null })}
        onSubmit={(data) => handleBulkAction('cancel', data)}
        selectedOrders={orders.filter(o => selectedOrders.includes(o.id))}
      />

      <KarigarHistoryModal
        isOpen={modalState.type === 'history'}
        onClose={() => setModalState({ type: null })}
        orderId={modalState.orderId || ""}
      />
    </div>
  );
}
