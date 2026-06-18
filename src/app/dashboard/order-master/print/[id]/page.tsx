"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintOrderPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { orders, customers, items, isLoading } = useAppData();
  
  const order = orders.find(o => o.id === id);

  useEffect(() => {
    const handleAfterPrint = () => {
      window.close();
    };
    window.addEventListener('afterprint', handleAfterPrint);

    let timer: NodeJS.Timeout;
    // Only trigger print when data is fully loaded and we have an order or know it's missing
    if (!isLoading) {
      // Automatically trigger print dialog after a short delay to allow images and fonts to render
      timer = setTimeout(() => {
        window.print();
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [id, isLoading]);

  if (isLoading) return <div className="p-6">Loading order details...</div>;
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
        /* Hide sidebar, header, and global wrappers entirely on this page */
        nav, header, aside, .fixed, .hidden.md\\:flex { display: none !important; }
        
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

        @media print {
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
        <div className="mb-6 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black tracking-tight uppercase">Order Slip - Neelkanth CRM</h1>
        </div>

        {/* Order Details Grid */}
        <div className="mb-6">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <tbody>
              <tr>
                <th className="bg-gray-100 p-2 border border-gray-300 w-[15%] text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Order No</th>
                <td className="p-2 border border-gray-300 w-[35%] font-medium text-gray-900">{order.orderNo || '-'}</td>
                <th className="bg-gray-100 p-2 border border-gray-300 w-[15%] text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Date</th>
                <td className="p-2 border border-gray-300 w-[35%] font-medium text-gray-900">{order.date || new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border border-gray-300 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Customer</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{customer?.customerName || order.name || 'Walk-in'}</td>
                <th className="bg-gray-100 p-2 border border-gray-300 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Item</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{finalItemName === "-" ? 'Custom' : finalItemName}</td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border border-gray-300 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Status</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.status || '-'}</td>
                <th className="bg-gray-100 p-2 border border-gray-300 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Delivery</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.deliveryDate || '-'}</td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border border-gray-300 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Color</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.colorCode || '-'}</td>
                <th className="bg-gray-100 p-2 border border-gray-300 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">Purity</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.purity || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Weights & Dimensions Table */}
        <div className="mb-6">
          <table className="w-full text-sm border-collapse border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300 font-semibold text-gray-700 uppercase tracking-wide text-xs">G.Wt</th>
                <th className="p-2 border border-gray-300 font-semibold text-gray-700 uppercase tracking-wide text-xs">L.Wt</th>
                <th className="p-2 border border-gray-300 font-semibold text-gray-700 uppercase tracking-wide text-xs">N.Wt</th>
                <th className="p-2 border border-gray-300 font-semibold text-gray-700 uppercase tracking-wide text-xs">Size</th>
                <th className="p-2 border border-gray-300 font-semibold text-gray-700 uppercase tracking-wide text-xs">Pcs</th>
                <th className="p-2 border border-gray-300 font-semibold text-gray-700 uppercase tracking-wide text-xs">Dimensions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.gWt || '-'}</td>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.lWt || '-'}</td>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.nWt || '-'}</td>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.size || '-'}</td>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.pcs || '-'}</td>
                <td className="p-2 border border-gray-300 font-medium text-gray-900">{order.height && order.width ? `${order.height}x${order.width}` : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <tbody>
              <tr>
                <th className="bg-gray-100 p-2 border border-gray-300 w-[15%] text-left font-semibold text-gray-700 align-top uppercase tracking-wide text-xs">Notes</th>
                <td className="p-2 border border-gray-300 font-medium text-gray-900 min-h-[60px] whitespace-pre-wrap">{order.orderDescription || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Photos */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Reference Images</h2>
          
          {(order.photo_1 || order.photo_2 || order.photo_3 || order.photo_4 || (order.photo && order.photo !== '-')) ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>Generated by Neelkanth CRM on {new Date().toLocaleString()}</p>
          <p className="mt-1">This is a system generated order slip.</p>
        </div>

      </div>
    </>
  );
}
