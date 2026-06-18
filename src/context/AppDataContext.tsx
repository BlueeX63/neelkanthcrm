"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  addCustomerAction, updateCustomerAction, deleteCustomerAction,
  addKarigarAction, updateKarigarAction, deleteKarigarAction,
  addItemAction, updateItemAction, deleteItemAction,
  updateUserAction, deleteUserAction,
  addOrderAction, updateOrderAction, deleteOrderAction,
  addHistoryAction, updateHistoryAction, closePreviousAssignedHistoryAction, getHistoryAction, getOrdersAction,
  revertHistoryToAssignedAction, deleteLatestHistoryAction
} from '@/app/actions/dbActions';

export interface AppDataContextType {
  customers: any[];
  addCustomer: (customer: any) => Promise<void>;
  updateCustomer: (id: string, data: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  users: any[];
  addUser: (user: any) => Promise<void>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  karigars: any[];
  addKarigar: (karigar: any) => Promise<void>;
  updateKarigar: (id: string, data: any) => Promise<void>;
  deleteKarigar: (id: string) => Promise<void>;

  items: any[];
  addItem: (item: any) => Promise<void>;
  updateItem: (id: string, data: any) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  orders: any[];
  addOrder: (order: any) => Promise<void>;
  updateOrder: (id: string, data: any) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  isLoading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [karigars, setKarigars] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // We use Promise.all to fetch everything in parallel
        const [
          { data: customersData },
          { data: usersData },
          { data: karigarsData },
          { data: itemsData },
          ordersData
        ] = await Promise.all([
          supabase.from("customers").select("*").order("created_at", { ascending: false }),
          supabase.from("users").select("*").order("created_at", { ascending: false }),
          supabase.from("karigars").select("*").order("created_at", { ascending: false }),
          supabase.from("items").select("*").order("created_at", { ascending: false }),
          getOrdersAction()
        ]);

        if (customersData) {
          // Map snake_case from DB to camelCase used in frontend
          setCustomers(customersData.map(c => ({
            ...c, 
            customerName: c.customer_name, 
            customerCode: c.customer_code,
            mobileNo: c.mobile_no,
            gstNo: c.gst_no,
            action: "Edit"
          })));
        }
        
        if (usersData) {
          setUsers(usersData.map(u => ({
            ...u,
            firstName: u.first_name,
            lastName: u.last_name,
            userType: u.user_type,
            action: "Edit"
          })));
        }

        if (karigarsData) {
          setKarigars(karigarsData.map(k => ({
            ...k,
            karigarName: k.karigar_name,
            karigarCode: k.karigar_code,
            mobileNo: k.mobile_no,
            action: "Edit"
          })));
        }

        if (itemsData) {
          setItems(itemsData.map(i => ({
            ...i,
            itemName: i.item_name,
            shortName: i.short_name,
            groupName: i.group_name,
            groupType: i.group_type,
            addedBy: i.added_by,
            action: "Edit"
          })));
        }
        if (ordersData) {
          setOrders(ordersData.map(o => ({
            ...o,
            history: o.order_karigar_history || [],
            orderNo: o.order_no,
            customerId: o.customer_id,
            colorCode: o.color_code,
            productId: o.product_id,
            deliveryDate: o.delivery_date,
            orderDescription: o.order_description,
            gWt: o.g_wt,
            lWt: o.l_wt,
            nWt: o.n_wt,
            pcs: o.pcs,
            processName: o.process_name,
            assignedKarigarId: o.assigned_karigar_id,
            assignedDate: o.assigned_date,
            receivingDate: o.receiving_date,
            deliveredDate: o.delivered_date,
            karigarDeliveredDate: o.karigar_delivered_date,
            cancelReason: o.cancel_reason,
            cancelDate: o.cancel_date,
            addedBy: o.added_by,
            action: "Edit"
          })));
        }
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Customer Operations
  const addCustomer = async (customer: any) => {
    try {
      setIsLoading(true);
      const dbCustomer = {
        customer_name: customer.customerName,
        customer_code: customer.customerCode,
        mobile_no: customer.mobileNo,
        address: customer.address,
        city: customer.city,
        gst_no: customer.gstNo,
        status: customer.status,
      };
      const data = await addCustomerAction(dbCustomer);
      if (data) {
        setCustomers(prev => [{
          ...data,
          customerName: data.customer_name,
          customerCode: data.customer_code,
          mobileNo: data.mobile_no,
          gstNo: data.gst_no,
          action: "Edit"
        }, ...prev]);
      }
    } catch (error) { console.error("Error adding customer:", error); }
    finally { setIsLoading(false); }
  };
  
  const updateCustomer = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      const dbData: any = {};
      if (data.customerName !== undefined) dbData.customer_name = data.customerName;
      if (data.customerCode !== undefined) dbData.customer_code = data.customerCode;
      if (data.mobileNo !== undefined) dbData.mobile_no = data.mobileNo;
      if (data.address !== undefined) dbData.address = data.address;
      if (data.city !== undefined) dbData.city = data.city;
      if (data.gstNo !== undefined) dbData.gst_no = data.gstNo;
      if (data.status !== undefined) dbData.status = data.status;
      
      await updateCustomerAction(id, dbData);
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    } catch (error) { console.error("Error updating customer:", error); }
    finally { setIsLoading(false); }
  };
  
  const deleteCustomer = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteCustomerAction(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (error) { console.error("Error deleting customer:", error); }
    finally { setIsLoading(false); }
  };

  // User Operations
  const addUser = async (user: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const { user: authUser } = await response.json();

      setUsers(prev => [{
        id: authUser.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        status: user.status,
        name: `${user.firstName} ${user.lastName}`,
        role: user.userType,
        action: "Edit"
      }, ...prev]);
    } catch (error: any) { 
      console.error("Error adding user:", error); 
      throw error;
    }
    finally { setIsLoading(false); }
  };
  
  const updateUser = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      const dbData: any = {};
      if (data.firstName !== undefined) dbData.first_name = data.firstName;
      if (data.lastName !== undefined) dbData.last_name = data.lastName;
      if (data.email !== undefined) dbData.email = data.email;
      if (data.phone !== undefined) dbData.phone = data.phone;
      if (data.userType !== undefined) dbData.user_type = data.userType;
      if (data.status !== undefined) dbData.status = data.status;
      if (data.name !== undefined) dbData.name = data.name;
      if (data.role !== undefined) dbData.role = data.role;
      
      await updateUserAction(id, dbData);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    } catch (error) { console.error("Error updating user:", error); }
    finally { setIsLoading(false); }
  };
  
  const deleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteUserAction(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) { console.error("Error deleting user:", error); }
    finally { setIsLoading(false); }
  };

  // Karigar Operations
  const addKarigar = async (karigar: any) => {
    try {
      setIsLoading(true);
      const dbKarigar = {
        karigar_name: karigar.karigarName,
        karigar_code: karigar.karigarCode,
        mobile_no: karigar.mobileNo,
        status: karigar.status
      };
      const data = await addKarigarAction(dbKarigar);
      if (data) {
        setKarigars(prev => [{
          ...data,
          karigarName: data.karigar_name,
          karigarCode: data.karigar_code,
          mobileNo: data.mobile_no,
          action: "Edit"
        }, ...prev]);
      }
    } catch (error) { console.error("Error adding karigar:", error); }
    finally { setIsLoading(false); }
  };
  
  const updateKarigar = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      const dbData: any = {};
      if (data.karigarName !== undefined) dbData.karigar_name = data.karigarName;
      if (data.karigarCode !== undefined) dbData.karigar_code = data.karigarCode;
      if (data.mobileNo !== undefined) dbData.mobile_no = data.mobileNo;
      if (data.status !== undefined) dbData.status = data.status;

      await updateKarigarAction(id, dbData);
      setKarigars(prev => prev.map(k => k.id === id ? { ...k, ...data } : k));
    } catch (error) { console.error("Error updating karigar:", error); }
    finally { setIsLoading(false); }
  };
  
  const deleteKarigar = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteKarigarAction(id);
      setKarigars(prev => prev.filter(k => k.id !== id));
    } catch (error) { console.error("Error deleting karigar:", error); }
    finally { setIsLoading(false); }
  };

  // Item Operations
  const addItem = async (item: any) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      const addedBy = user?.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
        : user?.email?.split('@')[0] || "Unknown User";

      const dbItem = {
        item_name: item.itemName,
        short_name: item.shortName,
        group_name: item.groupName,
        group_type: item.groupType,
        touch: item.touch,
        status: item.status,
        added_by: addedBy,
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
      };
      const data = await addItemAction(dbItem);
      if (data) {
        setItems(prev => [{
          ...data,
          itemName: data.item_name,
          shortName: data.short_name,
          groupName: data.group_name,
          groupType: data.group_type,
          addedBy: data.added_by,
          action: "Edit"
        }, ...prev]);
      }
    } catch (error) { console.error("Error adding item:", error); }
    finally { setIsLoading(false); }
  };
  
  const updateItem = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      const dbData: any = {};
      if (data.itemName !== undefined) dbData.item_name = data.itemName;
      if (data.shortName !== undefined) dbData.short_name = data.shortName;
      if (data.groupName !== undefined) dbData.group_name = data.groupName;
      if (data.groupType !== undefined) dbData.group_type = data.groupType;
      if (data.touch !== undefined) dbData.touch = data.touch;
      if (data.status !== undefined) dbData.status = data.status;

      await updateItemAction(id, dbData);
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    } catch (error) { console.error("Error updating item:", error); }
    finally { setIsLoading(false); }
  };
  
  const deleteItem = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteItemAction(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) { console.error("Error deleting item:", error); }
    finally { setIsLoading(false); }
  };

  // Order Operations
  const addOrder = async (order: any) => {
    try {
      setIsLoading(true);
      // Upload images if any
      const photoUrls: (string | null)[] = [null, null, null, null];
      if (order.files && order.files.length > 0) {
        for (let i = 0; i < order.files.length; i++) {
          const file = order.files[i];
          if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `orders/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('order-images')
              .upload(filePath, file);

            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from('order-images')
                .getPublicUrl(filePath);
              photoUrls[i] = publicUrlData.publicUrl;
            } else {
              console.error("Upload error:", uploadError);
              alert(`Image upload failed: ${uploadError.message}. Please check your Supabase Storage policies.`);
            }
          }
        }
      }

      // Find latest order number
      let nextOrderNo = "0005001";
      if (orders.length > 0) {
        const sortedOrders = [...orders].sort((a, b) => b.orderNo.localeCompare(a.orderNo));
        const highestOrderNoStr = sortedOrders[0].orderNo;
        const highestOrderNo = parseInt(highestOrderNoStr, 10);
        if (!isNaN(highestOrderNo)) {
          nextOrderNo = (highestOrderNo + 1).toString().padStart(7, '0');
        }
      }

      const dbOrder = {
        order_no: nextOrderNo,
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        photo: photoUrls[0] || "-",
        name: order.name || "-",
        status: order.status || "Assign Karigar",
        cad: order.cad || "-",
        designing: order.designing || "-",
        casting: order.casting || "-",
        filling: order.filling || "-",
        stone: order.stone || "-",
        polish: order.polish || "-",
        customer_id: order.customerId || null,
        color_code: order.colorCode,
        delivery_date: order.deliveryDate || null,
        product_id: order.productId || null,
        g_wt: order.gWt || null,
        l_wt: order.lWt || null,
        n_wt: order.nWt || null,
        purity: order.purity || null,
        pcs: order.pcs || null,
        size: order.size || null,
        height: order.height || null,
        width: order.width || null,
        order_description: order.orderDescription || null,
        photo_1: photoUrls[0] || null,
        photo_2: photoUrls[1] || null,
        photo_3: photoUrls[2] || null,
        photo_4: photoUrls[3] || null,
        process_name: order.processName || null,
        assigned_karigar_id: order.assignedKarigarId || null,
        assigned_date: order.assignedDate || null,
        receiving_date: order.receivingDate || null,
        delivered_date: order.deliveredDate || null,
        added_by: order.addedBy || null,
      };

      const data = await addOrderAction(dbOrder);
      if (data) {
        setOrders(prev => [{
          ...data,
          orderNo: data.order_no,
          customerId: data.customer_id,
          colorCode: data.color_code,
          productId: data.product_id,
          deliveryDate: data.delivery_date,
          orderDescription: data.order_description,
          gWt: data.g_wt,
          lWt: data.l_wt,
          nWt: data.n_wt,
          processName: data.process_name,
          assignedKarigarId: data.assigned_karigar_id,
          assignedDate: data.assigned_date,
          receivingDate: data.receiving_date,
          deliveredDate: data.delivered_date,
          addedBy: data.added_by,
          action: "Edit"
        }, ...prev]);
      }
    } catch (error) { console.error("Error adding order:", error); }
    finally { setIsLoading(false); }
  };
  
  const updateOrder = async (id: string, data: any) => {
    try {
      setIsLoading(true);
      const order = orders.find(o => o.id === id);
      const statusOrder = ['Order Confirmed', 'Assigned Karigar', 'Received from Karigar', 'Delivered'];
      const oldStatusIdx = order ? statusOrder.indexOf(order.status) : -1;
      const newStatusIdx = data.status ? statusOrder.indexOf(data.status) : -1;
      const isRollback = oldStatusIdx !== -1 && newStatusIdx !== -1 && newStatusIdx < oldStatusIdx;
      
      if (isRollback) {
        if (oldStatusIdx === 3) { // Rollback from Delivered
          data.deliveredDate = null;
        }
        if (oldStatusIdx >= 2 && newStatusIdx < 2) { // Rollback from Received to Assigned or Confirmed
          data.karigarDeliveredDate = null;
          if (newStatusIdx === 1) {
            try { await revertHistoryToAssignedAction(id); } catch (e) { console.error("Error reverting history:", e); }
          }
        }
        if (oldStatusIdx >= 1 && newStatusIdx < 1) { // Rollback from Assigned to Confirmed
          data.assignedKarigarId = null;
          data.assignedDate = null;
          data.receivingDate = null;
          try { await deleteLatestHistoryAction(id); } catch (e) { console.error("Error deleting history:", e); }
        }
      }

      const dbData: any = {};
      if (data.orderNo !== undefined) dbData.order_no = data.orderNo;
      if (data.customerId !== undefined) dbData.customer_id = data.customerId;
      if (data.colorCode !== undefined) dbData.color_code = data.colorCode;
      if (data.photo !== undefined) dbData.photo = data.photo;
      if (data.name !== undefined) dbData.name = data.name;
      if (data.status !== undefined) dbData.status = data.status;
      if (data.cad !== undefined) dbData.cad = data.cad;
      if (data.designing !== undefined) dbData.designing = data.designing;
      if (data.casting !== undefined) dbData.casting = data.casting;
      if (data.filling !== undefined) dbData.filling = data.filling;
      if (data.stone !== undefined) dbData.stone = data.stone;
      if (data.polish !== undefined) dbData.polish = data.polish;
      
      // New mapping logic for updated order schema
      if (data.deliveryDate !== undefined) dbData.delivery_date = data.deliveryDate || null;
      if (data.productId !== undefined) dbData.product_id = data.productId;
      if (data.gWt !== undefined) dbData.g_wt = data.gWt;
      if (data.lWt !== undefined) dbData.l_wt = data.lWt;
      if (data.nWt !== undefined) dbData.n_wt = data.nWt;
      if (data.pcs !== undefined) dbData.pcs = data.pcs;
      if (data.size !== undefined) dbData.size = data.size;
      if (data.height !== undefined) dbData.height = data.height;
      if (data.width !== undefined) dbData.width = data.width;
      if (data.purity !== undefined) dbData.purity = data.purity;
      if (data.orderDescription !== undefined) dbData.order_description = data.orderDescription;
      if (data.orderImage !== undefined) dbData.order_image = data.orderImage;
      if (data.photo_1 !== undefined) dbData.photo_1 = data.photo_1;
      if (data.photo_2 !== undefined) dbData.photo_2 = data.photo_2;
      if (data.photo_3 !== undefined) dbData.photo_3 = data.photo_3;
      if (data.photo_4 !== undefined) dbData.photo_4 = data.photo_4;
      if (data.date !== undefined) dbData.date = data.date || null;
      if (data.processName !== undefined) dbData.process_name = data.processName;
      if (data.assignedKarigarId !== undefined) dbData.assigned_karigar_id = data.assignedKarigarId || null;
      if (data.assignedDate !== undefined) dbData.assigned_date = data.assignedDate || null;
      if (data.receivingDate !== undefined) dbData.receiving_date = data.receivingDate || null;
      if (data.deliveredDate !== undefined) dbData.delivered_date = data.deliveredDate || null;
      if (data.karigarDeliveredDate !== undefined) dbData.karigar_delivered_date = data.karigarDeliveredDate || null;
      if (data.cancelReason !== undefined) dbData.cancel_reason = data.cancelReason || null;
      if (data.cancelDate !== undefined) dbData.cancel_date = data.cancelDate || null;
      if (data.addedBy !== undefined) dbData.added_by = data.addedBy || null;

      try {
        await updateOrderAction(id, dbData);
      } catch (error: any) {
        alert("Failed to update order in database: " + error.message);
        throw error;
      }

      if (!isRollback) {
        if (data.status === 'Assigned Karigar') {
          // If order was already assigned, close the previous history record
          if (order?.status === 'Assigned Karigar') {
            try {
              await closePreviousAssignedHistoryAction(id, data.assignedDate || new Date().toISOString().split('T')[0]);
            } catch (updateHistoryError) {
              console.error("Error updating history on reassignment:", updateHistoryError);
            }
          }

          try {
            await addHistoryAction({
              order_id: id,
              karigar_id: data.assignedKarigarId || order?.assignedKarigarId || null,
              process_name: data.processName || order?.processName || null,
              action_type: 'Assigned',
              action_date: data.assignedDate || new Date().toISOString().split('T')[0],
              expected_date: data.receivingDate || order?.receivingDate || null
            });
          } catch (insertHistoryError: any) {
            console.error("Error inserting assignment history:", insertHistoryError.message);
          }

        } else if (data.status === 'Received from Karigar') {
        const order = orders.find(o => o.id === id);
        try {
          const updatedCount = await closePreviousAssignedHistoryAction(id, data.karigarDeliveredDate || new Date().toISOString().split('T')[0]);
          
          if (updatedCount === 0) {
            // Fallback if closing previous history didn't exist
            try {
              await addHistoryAction({
                order_id: id,
                karigar_id: order?.assignedKarigarId || null,
                process_name: order?.processName || null,
                action_type: 'Received',
                action_date: order?.assignedDate || new Date().toISOString().split('T')[0],
                received_date: data.karigarDeliveredDate || new Date().toISOString().split('T')[0],
                expected_date: order?.receivingDate || null
              });
            } catch (insertReceiveError) {
              console.error("Error inserting fallback receive history:", insertReceiveError);
            }
          }
        } catch (updateReceiveError) {
          console.error("Error updating receive history:", updateReceiveError);
        }
      }
    }

    let updatedHistory: any[] | undefined = undefined;
      try {
        const histData = await getHistoryAction(id);
        if (histData) updatedHistory = histData;
      } catch (err) {
        console.error("Error fetching updated history", err);
      }

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...data, ...(updatedHistory ? { history: updatedHistory } : {}) } : o));
    } catch (error) { console.error("Error updating order:", error); }
    finally { setIsLoading(false); }
  };
  
  const deleteOrder = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteOrderAction(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) { console.error("Error deleting order:", error); }
    finally { setIsLoading(false); }
  };

  return (
    <AppDataContext.Provider value={{
      customers, addCustomer, updateCustomer, deleteCustomer,
      users, addUser, updateUser, deleteUser,
      karigars, addKarigar, updateKarigar, deleteKarigar,
      items, addItem, updateItem, deleteItem,
      orders, addOrder, updateOrder, deleteOrder,
      isLoading
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
