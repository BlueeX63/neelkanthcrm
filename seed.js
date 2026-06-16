
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function clearData() {
  console.log("Clearing order_karigar_history...");
  await supabase.from('order_karigar_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Clearing orders...");
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Clearing customers...");
  await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Clearing karigars...");
  await supabase.from('karigars').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Clearing items...");
  await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Clearing public.users...");
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Clearing auth.users...");
  // We have to list all users and delete them one by one
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) console.error("Error listing users:", listError);
  if (users) {
    for (const u of users) {
      await supabase.auth.admin.deleteUser(u.id);
    }
  }
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

async function seed() {
  await clearData();

  console.log("Creating user1@example.com...");
  const { data: userAuth, error: authError } = await supabase.auth.admin.createUser({
    email: 'user1@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      first_name: 'Admin',
      last_name: 'User',
      user_type: 'ADMINISTRATOR'
    }
  });

  if (authError) {
    console.error("Error creating user:", authError);
    return;
  }

  // Create 10 customers
  console.log("Creating 10 customers...");
  const customers = [];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Surat", "Jaipur", "Kolkata"];
  for (let i = 1; i <= 10; i++) {
    const { data } = await supabase.from('customers').insert({
      customer_name: `Customer ${i} Jewelers`,
      customer_code: `CUST${i.toString().padStart(3, '0')}`,
      mobile_no: `9876543${i.toString().padStart(3, '0')}`,
      address: `${i * 10} Main Market`,
      city: cities[Math.floor(Math.random() * cities.length)],
      gst_no: `27ABCDE1234F${i}Z5`,
      status: 'Active'
    }).select().single();
    if (data) customers.push(data);
  }

  // Create 5 karigars
  console.log("Creating 5 karigars...");
  const karigars = [];
  const karigarNames = ["Amit Sharma", "Vikram Singh", "Rahul Verma", "Suresh Kumar", "Manoj Das"];
  for (let i = 0; i < 5; i++) {
    const { data } = await supabase.from('karigars').insert({
      karigar_name: karigarNames[i],
      karigar_code: `KAR${(i+1).toString().padStart(3, '0')}`,
      mobile_no: `998877665${i}`,
      status: 'Active'
    }).select().single();
    if (data) karigars.push(data);
  }

  // Create 15 items
  console.log("Creating 15 items...");
  const items = [];
  const itemNames = ["Gold Ring", "Diamond Ring", "Gold Chain", "Silver Anklet", "Platinum Band", "Emerald Necklace", "Ruby Studs", "Gold Bangle", "Diamond Pendant", "Gold Mangalsutra", "Silver Coin", "Gold Bracelet", "Pearl Drops", "Gold Nosepin", "Diamond Choker"];
  for (let i = 0; i < 15; i++) {
    const { data } = await supabase.from('items').insert({
      item_name: itemNames[i],
      short_name: itemNames[i].substring(0, 3).toUpperCase(),
      group_name: i < 5 ? "Rings" : i < 10 ? "Necklaces" : "Bracelets",
      group_type: "Gold",
      touch: "22K",
      status: 'Active',
      added_by: 'Admin User',
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
    }).select().single();
    if (data) items.push(data);
  }

  // Create 50 orders
  console.log("Creating 50 orders...");
  const statuses = ["Order Confirmed", "Assigned Karigar", "Received from Karigar", "Delivered", "Cancelled"];
  const processes = ["GHAT", "CAD", "Casting", "Filing", "Stone Setting", "Polish"];
  const colors = ["Yellow", "Rose", "White"];
  
  for (let i = 1; i <= 50; i++) {
    const c = customers[Math.floor(Math.random() * customers.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const k = karigars[Math.floor(Math.random() * karigars.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const process = processes[Math.floor(Math.random() * processes.length)];
    
    const assignedDate = randomDate(new Date(2025, 0, 1), new Date());
    const expectedDate = new Date(new Date(assignedDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const deliveredDate = new Date(new Date(expectedDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const orderNo = (1000 + i).toString().padStart(7, '0');

    const dbOrder = {
      order_no: orderNo,
      date: randomDate(new Date(2025, 0, 1), new Date()).split('-').reverse().join('-'), // DD-MM-YYYY roughly
      customer_id: c.id,
      product_id: item.id,
      name: item.item_name,
      color_code: colors[Math.floor(Math.random() * colors.length)],
      status: status,
      g_wt: (Math.random() * 50 + 10).toFixed(3),
      l_wt: (Math.random() * 5).toFixed(3),
      n_wt: (Math.random() * 45 + 10).toFixed(3),
      pcs: Math.floor(Math.random() * 5) + 1,
      process_name: status !== "Order Confirmed" && status !== "Cancelled" ? process : null,
      assigned_karigar_id: status !== "Order Confirmed" && status !== "Cancelled" ? k.id : null,
      assigned_date: status !== "Order Confirmed" && status !== "Cancelled" ? assignedDate : null,
      receiving_date: status !== "Order Confirmed" && status !== "Cancelled" ? expectedDate : null,
      karigar_delivered_date: (status === "Received from Karigar" || status === "Delivered") ? deliveredDate : null,
      delivered_date: status === "Delivered" ? new Date(new Date(deliveredDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      cancel_reason: status === "Cancelled" ? "Customer requested cancellation" : null,
      cancel_date: status === "Cancelled" ? new Date().toISOString().split('T')[0] : null,
      added_by: 'Admin User',
      cad: Math.random() > 0.5 ? "Yes" : "No",
      casting: Math.random() > 0.5 ? "Yes" : "No",
      filling: Math.random() > 0.5 ? "Yes" : "No",
      stone: Math.random() > 0.5 ? "Yes" : "No",
      polish: Math.random() > 0.5 ? "Yes" : "No",
    };

    const { data: orderData, error: orderError } = await supabase.from('orders').insert(dbOrder).select().single();

    if (orderData && status !== "Order Confirmed" && status !== "Cancelled") {
      // Create history
      await supabase.from('order_karigar_history').insert({
        order_id: orderData.id,
        karigar_id: k.id,
        process_name: process,
        action_type: status === "Assigned Karigar" ? "Assigned" : "Received",
        action_date: assignedDate,
        expected_date: expectedDate,
        received_date: (status === "Received from Karigar" || status === "Delivered") ? deliveredDate : null
      });
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
