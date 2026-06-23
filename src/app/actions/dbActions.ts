'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// --- Schemas (no .passthrough() — only declared fields are allowed) ---

const customerSchema = z.object({
  customer_name: z.string().min(1),
  customer_code: z.string().optional(),
  mobile_no: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  gst_no: z.string().optional(),
  status: z.string().optional(),
});

const karigarSchema = z.object({
  karigar_name: z.string().min(1),
  karigar_code: z.string().optional(),
  mobile_no: z.string().optional(),
  status: z.string().optional(),
});

const itemSchema = z.object({
  item_name: z.string().min(1),
  short_name: z.string().optional(),
  group_name: z.string().optional(),
  group_type: z.string().optional(),
  touch: z.string().optional(),
  status: z.string().optional(),
  added_by: z.string().optional(),
  date: z.string().optional(),
});

const userUpdateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  user_type: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
});

const orderSchema = z.object({
  order_no: z.string().min(1),
  date: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  cad: z.string().optional().nullable(),
  cpx: z.string().optional().nullable(),
  casting: z.string().optional().nullable(),
  filling: z.string().optional().nullable(),
  stone: z.string().optional().nullable(),
  polish: z.string().optional().nullable(),
  customer_id: z.string().optional().nullable(),
  color_code: z.string().optional().nullable(),
  karigar_delivered_date: z.string().optional().nullable(),
  cancel_reason: z.string().optional().nullable(),
  cancel_date: z.string().optional().nullable(),
  added_by: z.string().optional().nullable(),
  delivery_date: z.string().optional().nullable(),
  product_id: z.string().optional().nullable(),
  g_wt: z.string().optional().nullable(),
  l_wt: z.string().optional().nullable(),
  n_wt: z.string().optional().nullable(),
  pcs: z.union([z.string(), z.number()]).optional().nullable(),
  size: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  width: z.string().optional().nullable(),
  purity: z.string().optional().nullable(),
  order_description: z.string().optional().nullable(),
  order_image: z.string().optional().nullable(),
  photo_1: z.string().optional().nullable(),
  photo_2: z.string().optional().nullable(),
  photo_3: z.string().optional().nullable(),
  photo_4: z.string().optional().nullable(),
  process_name: z.string().optional().nullable(),
  assigned_karigar_id: z.string().optional().nullable(),
  assigned_date: z.string().optional().nullable(),
  receiving_date: z.string().optional().nullable(),
  delivered_date: z.string().optional().nullable(),
});

const historySchema = z.object({
  order_id: z.string(),
  karigar_id: z.string().nullable().optional(),
  process_name: z.string().nullable().optional(),
  action_type: z.enum(['Assigned', 'Received']),
  action_date: z.string().nullable().optional(),
  expected_date: z.string().nullable().optional(),
  received_date: z.string().nullable().optional(),
});

const historyUpdateSchema = z.object({
  action_type: z.enum(['Assigned', 'Received']).optional(),
  received_date: z.string().nullable().optional(),
  action_date: z.string().nullable().optional(),
  expected_date: z.string().nullable().optional(),
});

// --- Customer Actions ---

export async function addCustomerAction(data: any) {
  const parsedData = customerSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("customers").insert(parsedData).select().single();
  if (error) {
    console.error("DB Error [addCustomer]:", error.message);
    throw new Error("Failed to add customer. Please try again.");
  }
  return result;
}

export async function updateCustomerAction(id: string, data: any) {
  const parsedData = customerSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("customers").update(parsedData).eq("id", id).select().single();
  if (error) {
    console.error("DB Error [updateCustomer]:", error.message);
    throw new Error("Failed to update customer. Please try again.");
  }
  return result;
}

export async function deleteCustomerAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) {
    console.error("DB Error [deleteCustomer]:", error.message);
    throw new Error("Failed to delete customer. Please try again.");
  }
}

// --- Karigar Actions ---

export async function addKarigarAction(data: any) {
  const parsedData = karigarSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("karigars").insert(parsedData).select().single();
  if (error) {
    console.error("DB Error [addKarigar]:", error.message);
    throw new Error("Failed to add karigar. Please try again.");
  }
  return result;
}

export async function updateKarigarAction(id: string, data: any) {
  const parsedData = karigarSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("karigars").update(parsedData).eq("id", id).select().single();
  if (error) {
    console.error("DB Error [updateKarigar]:", error.message);
    throw new Error("Failed to update karigar. Please try again.");
  }
  return result;
}

export async function deleteKarigarAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("karigars").delete().eq("id", id);
  if (error) {
    console.error("DB Error [deleteKarigar]:", error.message);
    throw new Error("Failed to delete karigar. Please try again.");
  }
}

// --- Item Actions ---

export async function addItemAction(data: any) {
  const parsedData = itemSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("items").insert(parsedData).select().single();
  if (error) {
    console.error("DB Error [addItem]:", error.message);
    throw new Error("Failed to add item. Please try again.");
  }
  return result;
}

export async function updateItemAction(id: string, data: any) {
  const parsedData = itemSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("items").update(parsedData).eq("id", id).select().single();
  if (error) {
    console.error("DB Error [updateItem]:", error.message);
    throw new Error("Failed to update item. Please try again.");
  }
  return result;
}

export async function deleteItemAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) {
    console.error("DB Error [deleteItem]:", error.message);
    throw new Error("Failed to delete item. Please try again.");
  }
}

// --- User Actions ---

export async function updateUserAction(id: string, data: any) {
  const parsedData = userUpdateSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("users").update(parsedData).eq("id", id).select().single();
  if (error) {
    console.error("DB Error [updateUser]:", error.message);
    throw new Error("Failed to update user. Please try again.");
  }
  return result;
}

export async function deleteUserAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) {
    console.error("DB Error [deleteUser]:", error.message);
    throw new Error("Failed to delete user. Please try again.");
  }
}

// --- Order Actions ---

export async function addOrderAction(data: any) {
  const parsedData = orderSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("orders").insert(parsedData).select().single();
  if (error) {
    console.error("DB Error [addOrder]:", error.message);
    throw new Error("Failed to create order. Please try again.");
  }
  return result;
}

export async function updateOrderAction(id: string, data: any) {
  const parsedData = orderSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("orders").update(parsedData).eq("id", id).select().single();
  if (error) {
    console.error("DB Error [updateOrder]:", error.message);
    throw new Error("Failed to update order. Please try again.");
  }
  return result;
}

export async function deleteOrderAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) {
    console.error("DB Error [deleteOrder]:", error.message);
    throw new Error("Failed to delete order. Please try again.");
  }
}

// --- History Actions ---

export async function addHistoryAction(data: any) {
  const parsedData = historySchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("order_karigar_history").insert(parsedData).select().single();
  if (error) {
    console.error("DB Error [addHistory]:", error.message);
    throw new Error("Failed to add history record. Please try again.");
  }
  return result;
}

export async function getHistoryAction(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("order_karigar_history").select("*").eq("order_id", orderId);
  if (error) {
    console.error("DB Error [getHistory]:", error.message);
    throw new Error("Failed to fetch history. Please try again.");
  }
  return data;
}

export async function getOrdersAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_karigar_history(*)`)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("DB Error [getOrders]:", error.message);
    throw new Error("Failed to fetch orders. Please try again.");
  }
  return data;
}

export async function updateHistoryAction(id: string, data: any) {
  const parsedData = historyUpdateSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("order_karigar_history").update(parsedData).eq("id", id).select().single();
  if (error) {
    console.error("DB Error [updateHistory]:", error.message);
    throw new Error("Failed to update history record. Please try again.");
  }
  return result;
}

export async function closePreviousAssignedHistoryAction(orderId: string, receivedDate: string) {
  const supabase = await createClient();
  const { data: openHistories, error: selectError } = await supabase
    .from("order_karigar_history")
    .select("id")
    .eq("order_id", orderId)
    .eq("action_type", "Assigned");
    
  if (selectError) {
    console.error("DB Error [closePreviousHistory]:", selectError.message);
    throw new Error("Failed to close previous history. Please try again.");
  }

  if (openHistories && openHistories.length > 0) {
    for (const h of openHistories) {
      const { error: updateError } = await supabase
        .from("order_karigar_history")
        .update({
          action_type: 'Received',
          received_date: receivedDate
        })
        .eq("id", h.id);
      if (updateError) {
        console.error("DB Error [closePreviousHistory update]:", updateError.message);
        throw new Error("Failed to update history record. Please try again.");
      }
    }
    return openHistories.length;
  }
  return 0;
}

export async function revertHistoryToAssignedAction(orderId: string) {
  const supabase = await createClient();
  const { data: latestHistories, error: selectError } = await supabase
    .from("order_karigar_history")
    .select("id")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (selectError) {
    console.error("DB Error [revertHistory]:", selectError.message);
    throw new Error("Failed to revert history. Please try again.");
  }

  if (latestHistories && latestHistories.length > 0) {
    const { error: updateError } = await supabase
      .from("order_karigar_history")
      .update({
        action_type: 'Assigned',
        received_date: null
      })
      .eq("id", latestHistories[0].id);
    if (updateError) {
      console.error("DB Error [revertHistory update]:", updateError.message);
      throw new Error("Failed to revert history. Please try again.");
    }
    return true;
  }
  return false;
}

export async function deleteLatestHistoryAction(orderId: string) {
  const supabase = await createClient();
  const { data: latestHistories, error: selectError } = await supabase
    .from("order_karigar_history")
    .select("id")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (selectError) {
    console.error("DB Error [deleteLatestHistory]:", selectError.message);
    throw new Error("Failed to delete history. Please try again.");
  }

  if (latestHistories && latestHistories.length > 0) {
    const { error: deleteError } = await supabase
      .from("order_karigar_history")
      .delete()
      .eq("id", latestHistories[0].id);
    if (deleteError) {
      console.error("DB Error [deleteLatestHistory delete]:", deleteError.message);
      throw new Error("Failed to delete history. Please try again.");
    }
    return true;
  }
  return false;
}
