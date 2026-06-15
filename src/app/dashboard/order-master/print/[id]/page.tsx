"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintOrderPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { orders, customers, items } = useAppData();
  
  const order = orders.find(o => o.id === id);

  useEffect(() => {
    // Automatically trigger print dialog after a short delay to allow images to load
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (!order) return <div className="p-6">Order not found</div>;

  const customer = customers.find(c => c.id === order.customerId);
  
  let finalItemName = order.itemName;
  if ((!finalItemName || finalItemName === "-") && order.productId) {
    const product = items.find(i => i.id === order.productId);
    finalItemName = product?.itemName || "-";
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide sidebar, header, and global wrappers */
          nav, header, aside, .fixed, .hidden.md\\:flex { display: none !important; }
          /* Override layout margins */
          main { 
            padding-left: 0 !important; 
            margin: 0 !important; 
            background: white !important;
          }
          body { 
            background: white !important; 
            margin: 0; 
            padding: 0;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .page-break { page-break-before: always; }
        }
      `}} />

      <div className="max-w-4xl mx-auto bg-white min-h-screen p-8 text-gray-900 font-sans shadow-sm border border-gray-100 rounded-md print:shadow-none print:border-none print:p-0">
        
        {/* Print Controls (Hidden during print) */}
        <div className="flex justify-between items-center mb-8 no-print border-b border-gray-100 pb-4">
          <button onClick={() => router.back()} className="flex items-center text-sm text-gray-600 hover:text-black transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
          <button onClick={() => window.print()} className="flex items-center text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">
            <Printer className="w-4 h-4 mr-2" />
            Print Order
          </button>
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-black pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Order Slip</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Neelkanth CRM</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">Order Number</p>
            <p className="text-2xl font-bold font-mono">{order.orderNo || 'N/A'}</p>
            <p className="text-sm text-gray-500 mt-2">Date: {order.date || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer & Product Info */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-5 rounded-md border border-gray-100">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Customer Details</h2>
            <p className="text-lg font-bold text-gray-900">{customer?.customerName || order.name || 'Walk-in Customer'}</p>
            <p className="text-sm text-gray-600 mt-1">{customer?.phone || ''}</p>
            <p className="text-sm text-gray-600">{customer?.email || ''}</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-md border border-gray-100">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Product Information</h2>
            <p className="text-lg font-bold text-gray-900">{finalItemName === "-" ? 'Custom Item' : finalItemName}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-sm"><span className="text-gray-500">Color:</span> <span className="font-semibold">{order.colorCode || '-'}</span></div>
              <div className="text-sm"><span className="text-gray-500">Purity:</span> <span className="font-semibold">{order.purity || '-'}</span></div>
              <div className="text-sm"><span className="text-gray-500">Delivery:</span> <span className="font-semibold">{order.deliveryDate || '-'}</span></div>
              <div className="text-sm"><span className="text-gray-500">Status:</span> <span className="font-semibold">{order.status || '-'}</span></div>
            </div>
          </div>
        </div>

        {/* Order Specifications Table */}
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Specifications</h2>
        <div className="border border-gray-200 rounded-md overflow-hidden mb-10">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs text-gray-600 font-bold">
              <tr>
                <th className="p-3">G.Wt</th>
                <th className="p-3">L.Wt</th>
                <th className="p-3">N.Wt</th>
                <th className="p-3">Size</th>
                <th className="p-3">Pieces</th>
                <th className="p-3">Dimensions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="font-semibold text-gray-900">
                <td className="p-3">{order.gWt || '-'}</td>
                <td className="p-3">{order.lWt || '-'}</td>
                <td className="p-3">{order.nWt || '-'}</td>
                <td className="p-3">{order.size || '-'}</td>
                <td className="p-3">{order.pcs || '-'}</td>
                <td className="p-3">{order.height && order.width ? `${order.height} x ${order.width}` : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes/Description */}
        {order.orderDescription && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description / Notes</h2>
            <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-md text-sm text-gray-800 italic">
              {order.orderDescription}
            </div>
          </div>
        )}

        {/* Photos */}
        <div className="mb-10 page-break">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Reference Images</h2>
          
          {(order.photo_1 || order.photo_2 || order.photo_3 || order.photo_4 || (order.photo && order.photo !== '-')) ? (
            <div className="grid grid-cols-2 gap-4">
              {[order.photo_1, order.photo_2, order.photo_3, order.photo_4, order.photo]
                .filter(Boolean)
                .filter(img => img !== '-')
                .slice(0, 4)
                .map((img, i) => (
                  <div key={i} className="border border-gray-200 p-2 rounded-md bg-gray-50 flex items-center justify-center aspect-square">
                    <img src={img} alt={`Reference ${i+1}`} className="max-w-full max-h-full object-contain mix-blend-multiply rounded" />
                  </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-gray-300 bg-gray-50 rounded-md flex items-center justify-center text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">No images uploaded</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>Generated by Neelkanth CRM on {new Date().toLocaleString()}</p>
          <p className="mt-1">This is a system generated order slip.</p>
        </div>

      </div>
    </>
  );
}
