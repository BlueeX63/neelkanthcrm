"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppData } from "@/context/AppDataContext";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintOrderPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { orders, items, customers, isLoading } = useAppData();

  const order = orders.find(o => o.id === id);

  useEffect(() => {
    const handleAfterPrint = () => {
      // window.close(); // You may want to keep or remove this depending on behavior
    };
    window.addEventListener('afterprint', handleAfterPrint);

    let timer: NodeJS.Timeout;
    if (!isLoading) {
      timer = setTimeout(() => {
        window.print();
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [id, isLoading]);

  if (isLoading) return <div className="p-6 font-sans">Loading order details...</div>;
  if (!order) return <div className="p-6 font-sans">Order not found</div>;

  let finalItemName = order.itemName;
  let finalItemTouch = order.purity;
  if (order.productId) {
    const product = items.find(i => i.id === order.productId);
    if ((!finalItemName || finalItemName === "-") && product) {
      finalItemName = product.itemName || "-";
    }
    if ((!finalItemTouch || finalItemTouch === "-") && product) {
      finalItemTouch = product.touch || "-";
    }
  }

  let customerName = "-";
  if (order.customerId) {
    const customer = customers.find(c => c.id === order.customerId);
    if (customer) {
      customerName = customer.customerName || "-";
    }
  }

  const images = [order.photo_1, order.photo_2, order.photo_3, order.photo_4, order.photo]
    .filter(Boolean)
    .filter(img => img !== '-');
  const uniqueImages = [...new Set(images)];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Hide sidebar, header, and global wrappers entirely on this page */
        nav, header, aside, .fixed, .hidden.md\\:flex { display: none !important; }
        
        main { 
          padding-left: 0 !important; 
          margin: 0 !important; 
          background: #e5e7eb !important; /* Gray background on screen for contrast */
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 20px !important;
        }
        body { 
          background: #e5e7eb !important; 
          margin: 0; 
          padding: 0;
        }

        @page {
          size: A5 portrait;
          margin: 5mm;
        }

        @media print {
          html, body { 
            background: white !important; 
            height: 100% !important; 
          }
          main {
            background: white !important;
            padding-top: 0 !important;
            display: block;
          }
          .no-print { display: none !important; }
          .print-container {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}} />

      <div className="flex flex-col gap-4">
        {/* Print Controls (Hidden during print) */}
        <div className="flex justify-between items-center no-print bg-white p-4 rounded-md shadow-sm w-[148mm]">
          <button onClick={() => router.back()} className="flex items-center text-sm text-gray-600 hover:text-black transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button onClick={() => window.print()} className="flex items-center text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">
            <Printer className="w-4 h-4 mr-2" />
            Print A5
          </button>
        </div>

        {/* A5 Print Canvas */}
        <div className="print-container w-[148mm] min-h-[210mm] bg-white text-black font-sans box-border p-2 shadow-lg">
          <div className="border-[1.5px] border-black h-full flex flex-col print:h-[calc(100vh-10mm)]">

            {/* Header */}
            <div className="text-center pt-4 pb-2 flex-shrink-0">
              <div className="flex justify-center mb-1">
                <img src="/logo.png" alt="Neelkanth Logo" className="h-12 object-contain" />
              </div>
              <h1 className="text-xl font-bold tracking-widest mb-1 mt-2">NEELKANTH</h1>
              <div className="border-t-[1.5px] border-b-[1.5px] border-black py-1 mt-1">
                <h2 className="text-base font-bold">Sales Order</h2>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse flex-shrink-0 mt-0">
              <tbody>
                <tr>
                  <td className="border-b-[1.5px] border-r-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-24 font-bold shrink-0">Order No.</span><span>: {order.orderNo || '-'}</span></div>
                  </td>
                  <td className="border-b-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-28 font-bold shrink-0">Customer Name</span><span>: {customerName}</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b-[1.5px] border-r-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-24 font-bold shrink-0">Order Date</span><span>: {order.date || '-'}</span></div>
                  </td>
                  <td className="border-b-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-28 font-bold shrink-0">Delivery Date</span><span>: {order.deliveryDate || '-'}</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b-[1.5px] border-r-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-24 font-bold shrink-0">Design No.</span><span>: {finalItemName || '-'}</span></div>
                  </td>
                  <td className="border-b-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-28 font-bold shrink-0">PCS</span><span>: {order.pcs || '-'}</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b-[1.5px] border-r-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-24 font-bold shrink-0">Touch</span><span>: {finalItemTouch || '-'}</span></div>
                  </td>
                  <td className="border-b-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-28 font-bold shrink-0">Size</span><span>: {order.size || '-'}</span></div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b-[1.5px] border-r-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-24 font-bold shrink-0">G.Weight</span><span>: {order.gWt || '-'}</span></div>
                  </td>
                  <td className="border-b-[1.5px] border-black p-1.5 px-3 text-[13px] w-1/2">
                    <div className="flex"><span className="w-28 font-bold shrink-0">Color</span><span>: {order.colorCode || '-'}</span></div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border-b-[1.5px] border-black p-1.5 px-3 text-[13px]">
                    <div className="flex"><span className="w-24 font-bold shrink-0">Narration</span><span className="whitespace-pre-wrap break-all flex-1">: {order.orderDescription || '-'}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Image Area */}
            <div className="flex flex-1 min-h-[250px]">
              <div className="w-1/2 border-r-[1.5px] border-black p-1.5 relative">
                {uniqueImages[0] ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <img src={uniqueImages[0] as string} alt="Reference 1" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ) : null}
              </div>
              <div className="w-1/2 p-1.5 relative">
                {uniqueImages[1] ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <img src={uniqueImages[1] as string} alt="Reference 2" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ) : null}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-500 py-1.5 border-t-[1.5px] border-black flex-shrink-0 italic">
              (This is a computer-generated sales order; no signature is required.)
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

