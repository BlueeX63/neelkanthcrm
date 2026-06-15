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
    const handleAfterPrint = () => {
      window.close();
    };
    window.addEventListener('afterprint', handleAfterPrint);

    // Automatically trigger print dialog after a short delay to allow images to load
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
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

        {/* Order Details Table */}
        <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
          <table className="w-full text-left text-[10px] sm:text-xs">
            <thead className="bg-gray-100 border-b border-gray-300 uppercase text-gray-700 font-bold">
              <tr>
                <th className="p-2 border-r border-gray-300">Order No</th>
                <th className="p-2 border-r border-gray-300">Date</th>
                <th className="p-2 border-r border-gray-300">Customer</th>
                <th className="p-2 border-r border-gray-300">Item</th>
                <th className="p-2 border-r border-gray-300">Color</th>
                <th className="p-2 border-r border-gray-300">Purity</th>
                <th className="p-2 border-r border-gray-300">Delivery</th>
                <th className="p-2 border-r border-gray-300">Status</th>
                <th className="p-2 border-r border-gray-300">G.Wt</th>
                <th className="p-2 border-r border-gray-300">L.Wt</th>
                <th className="p-2 border-r border-gray-300">N.Wt</th>
                <th className="p-2 border-r border-gray-300">Size</th>
                <th className="p-2 border-r border-gray-300">Pcs</th>
                <th className="p-2 border-r border-gray-300">Dims</th>
                <th className="p-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="font-medium text-gray-900 bg-white">
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.orderNo || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.date || new Date().toLocaleDateString()}</td>
                <td className="p-2 border-r border-gray-300">{customer?.customerName || order.name || 'Walk-in'}</td>
                <td className="p-2 border-r border-gray-300">{finalItemName === "-" ? 'Custom' : finalItemName}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.colorCode || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.purity || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.deliveryDate || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.status || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.gWt || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.lWt || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.nWt || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.size || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.pcs || '-'}</td>
                <td className="p-2 border-r border-gray-300 whitespace-nowrap">{order.height && order.width ? `${order.height}x${order.width}` : '-'}</td>
                <td className="p-2 min-w-[120px]">{order.orderDescription || '-'}</td>
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
