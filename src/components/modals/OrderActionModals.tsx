"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedOrders: any[];
  karigars: any[];
}

export function AssignKarigarModal({ isOpen, onClose, onSubmit, selectedOrders, karigars }: ModalProps) {
  const [formData, setFormData] = useState({
    processName: "GHAT",
    karigarId: "",
    assignedDate: new Date().toISOString().split('T')[0],
    receivingDate: ""
  });

  useEffect(() => {
    if (isOpen && selectedOrders.length > 0) {
      const sample = selectedOrders[0];
      setFormData({
        processName: sample.processName || "GHAT",
        karigarId: sample.assignedKarigarId || "",
        assignedDate: sample.assignedDate || new Date().toISOString().split('T')[0],
        receivingDate: sample.receivingDate || ""
      });
    }
  }, [isOpen, selectedOrders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-lg text-gray-900">Assign Karigar ({selectedOrders.length} orders)</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Process Name <span className="text-red-500">*</span></label>
            <Select 
              value={formData.processName} 
              onChange={(v) => setFormData({...formData, processName: v})} 
              options={[
                {value: "GHAT", label: "GHAT"},
                {value: "CAD", label: "CAD"},
                {value: "CPX", label: "CPX"},
                {value: "Casting", label: "Casting"},
                {value: "Filling", label: "Filling"},
                {value: "Stone Setting", label: "Stone Setting"},
                {value: "POLISHED", label: "POLISHED"}
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Karigar Name <span className="text-red-500">*</span></label>
            <Select 
              value={formData.karigarId} 
              onChange={(v) => setFormData({...formData, karigarId: v})} 
              options={karigars.map(k => ({value: k.id, label: k.karigarName}))}
              placeholder="Select Karigar..."
              searchable
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Assigned Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={formData.assignedDate} 
              onChange={(e) => setFormData({...formData, assignedDate: e.target.value})} 
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Expected Receiving Date</label>
            <input 
              type="date" 
              value={formData.receivingDate} 
              onChange={(e) => setFormData({...formData, receivingDate: e.target.value})} 
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
          <Button variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
          <Button variant="primary" onClick={() => onSubmit(formData)} disabled={!formData.karigarId}>Assign Karigar</Button>
        </div>
      </motion.div>
    </div>
  );
}

export function ReceiveKarigarModal({ isOpen, onClose, onSubmit, selectedOrders, karigars }: ModalProps) {
  // We use the first selected order's data to show the static info, assuming bulk receive implies they were assigned together or we just show the first one's info.
  // A better approach is if multiple are selected, we might just say "Multiple Orders".
  const sampleOrder = selectedOrders[0] || {};
  const sampleKarigar = karigars.find(k => k.id === sampleOrder.assignedKarigarId)?.karigarName || "-";

  const [karigarDeliveredDate, setKarigarDeliveredDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-lg text-gray-900">Receive from Karigar ({selectedOrders.length} orders)</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 bg-gray-50 p-3 rounded-md border border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase">Process</label>
              <div className="text-sm font-medium text-gray-900">{sampleOrder.processName || "-"}</div>
            </div>
            <div className="space-y-1 bg-gray-50 p-3 rounded-md border border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase">Karigar</label>
              <div className="text-sm font-medium text-gray-900 truncate" title={sampleKarigar}>{sampleKarigar}</div>
            </div>
            <div className="space-y-1 bg-gray-50 p-3 rounded-md border border-gray-100 col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Assigned Date</label>
              <div className="text-sm font-medium text-gray-900">{sampleOrder.assignedDate || "-"}</div>
            </div>
            <div className="space-y-1 bg-gray-50 p-3 rounded-md border border-gray-100 col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Expected Receiving Date</label>
              <div className="text-sm font-medium text-gray-900">{sampleOrder.receivingDate || "-"}</div>
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-gray-700">Actual Received Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={karigarDeliveredDate} 
              onChange={(e) => setKarigarDeliveredDate(e.target.value)} 
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
          <Button variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
          <Button variant="primary" onClick={() => onSubmit({ karigarDeliveredDate })}>Mark Received</Button>
        </div>
      </motion.div>
    </div>
  );
}

export function DeliverModal({ isOpen, onClose, onSubmit, selectedOrders }: Omit<ModalProps, "karigars">) {
  const sampleOrder = selectedOrders[0] || {};
  const [deliveredDate, setDeliveredDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState(sampleOrder.deliveryDate || new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-lg text-gray-900">Deliver to Customer ({selectedOrders.length} orders)</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Expected Delivery Date</label>
            <input 
              type="date" 
              value={deliveryDate} 
              onChange={(e) => setDeliveryDate(e.target.value)} 
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Actual Delivered Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={deliveredDate} 
              onChange={(e) => setDeliveredDate(e.target.value)} 
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
          <Button variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
          <Button variant="primary" onClick={() => onSubmit({ deliveryDate, deliveredDate })}>Mark Delivered</Button>
        </div>
      </motion.div>
    </div>
  );
}

export function CancelConfirmModal({ isOpen, onClose, onSubmit, selectedOrders }: Omit<ModalProps, "karigars">) {
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDate, setCancelDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
      >
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Cancel Orders?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to cancel {selectedOrders.length} selected order(s)?
            </p>
          </div>
          <div className="space-y-3 pt-2 text-left">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Cancel Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={cancelDate} 
                onChange={(e) => setCancelDate(e.target.value)} 
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Cancel Reason <span className="text-red-500">*</span></label>
              <textarea 
                value={cancelReason} 
                onChange={(e) => setCancelReason(e.target.value)} 
                placeholder="Enter reason for cancellation"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none h-20" 
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="bg-white">Keep Orders</Button>
          <Button variant="primary" onClick={() => onSubmit({ cancelReason, cancelDate })} disabled={!cancelReason} className="bg-red-500 hover:bg-red-600 text-white border-transparent">Yes, Cancel</Button>
        </div>
      </motion.div>
    </div>
  );
}

export function KarigarHistoryModal({ isOpen, onClose, orderId }: { isOpen: boolean, onClose: () => void, orderId: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchHistory = async () => {
        setLoading(true);
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data, error } = await supabase
          .from('order_karigar_history')
          .select('*, karigars(karigar_name)')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setHistory(data);
        }
        setLoading(false);
      };
      fetchHistory();
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <h3 className="font-semibold text-lg text-gray-900">Karigar History</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-0 overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No karigar history found for this order.</div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Assigned Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Received Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Process</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Karigar Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-700">{h.action_date || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{h.received_date || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        h.action_type === 'Received' ? 'bg-green-50 text-green-700 border border-green-200' :
                        h.action_type === 'Reassigned' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {h.action_type === 'Received' ? 'Completed' : h.action_type === 'Reassigned' ? 'Reassigned' : 'Working'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{h.process_name || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{h.karigars?.karigar_name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <Button variant="outline" onClick={onClose} className="bg-white">Close</Button>
        </div>
      </motion.div>
    </div>
  );
}
