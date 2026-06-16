'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const customerSchema = z.object({
  customer_name: z.string().min(1),
  customer_code: z.string().optional(),
  mobile_no: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  gst_no: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

export async function addCustomerAction(data: any) {
  const parsedData = customerSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("customers").insert(parsedData).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function updateCustomerAction(id: string, data: any) {
  const parsedData = customerSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("customers").update(parsedData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function deleteCustomerAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

const karigarSchema = z.object({
  karigar_name: z.string().min(1),
  karigar_code: z.string().optional(),
  mobile_no: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

export async function addKarigarAction(data: any) {
  const parsedData = karigarSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("karigars").insert(parsedData).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function updateKarigarAction(id: string, data: any) {
  const parsedData = karigarSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("karigars").update(parsedData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function deleteKarigarAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("karigars").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

const itemSchema = z.object({
  item_name: z.string().min(1),
  short_name: z.string().optional(),
  group_name: z.string().optional(),
  group_type: z.string().optional(),
  touch: z.string().optional(),
  status: z.string().optional(),
  added_by: z.string().optional(),
  date: z.string().optional(),
}).passthrough();

export async function addItemAction(data: any) {
  const parsedData = itemSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("items").insert(parsedData).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function updateItemAction(id: string, data: any) {
  const parsedData = itemSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("items").update(parsedData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function deleteItemAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateUserAction(id: string, data: any) {
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("users").update(data).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function deleteUserAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Orders and History

const orderSchema = z.object({
  order_no: z.string().min(1),
  date: z.string().optional(),
  photo: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  cad: z.string().optional(),
  casting: z.string().optional(),
  filling: z.string().optional(),
  stone: z.string().optional(),
  polish: z.string().optional(),
  customer_id: z.string().optional(),
  color_code: z.string().optional(),
  karigar_delivered_date: z.string().optional().nullable(),
  cancel_reason: z.string().optional().nullable(),
  cancel_date: z.string().optional().nullable(),
  added_by: z.string().optional(),
}).passthrough();

export async function addOrderAction(data: any) {
  const parsedData = orderSchema.parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("orders").insert(parsedData).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function updateOrderAction(id: string, data: any) {
  const parsedData = orderSchema.partial().parse(data);
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("orders").update(parsedData).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function deleteOrderAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addHistoryAction(data: any) {
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("order_karigar_history").insert(data).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function getHistoryAction(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("order_karigar_history").select("*").eq("order_id", orderId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getOrdersAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_karigar_history(*)`)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateHistoryAction(id: string, data: any) {
  const supabase = await createClient();
  const { data: result, error } = await supabase.from("order_karigar_history").update(data).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function closePreviousAssignedHistoryAction(orderId: string, receivedDate: string) {
  const supabase = await createClient();
  const { data: openHistories, error: selectError } = await supabase
    .from("order_karigar_history")
    .select("id")
    .eq("order_id", orderId)
    .eq("action_type", "Assigned");
    
  if (selectError) throw new Error(selectError.message);

  if (openHistories && openHistories.length > 0) {
    for (const h of openHistories) {
      const { error: updateError } = await supabase
        .from("order_karigar_history")
        .update({
          action_type: 'Received',
          received_date: receivedDate
        })
        .eq("id", h.id);
      if (updateError) throw new Error(updateError.message);
    }
    return openHistories.length;
  }
  return 0;
}

// Storage Action
export async function getStorageSignedUrl(bucket: string, path: string) {
  const supabase = await createClient();
  // Using an upload action doesn't work well via server action for large files,
  // so we generate a signed upload URL or we can let them use the frontend client
  // BUT the frontend client is insecure without bucket policies.
  // Given we will add bucket policies for auth, uploading from frontend client is fine.
  // We'll skip file upload server action for now and rely on bucket RLS.
}
