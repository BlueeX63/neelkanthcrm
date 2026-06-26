"use client";

import StatCard from "@/components/ui/StatCard";
import ChartCard from "@/components/ui/ChartCard";
import { Users, UserPlus, HardHat, Package, ShoppingCart, CheckCircle2, UserCog, UserCheck, Truck, XCircle, Edit } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useAppData } from "@/context/AppDataContext";
import ApexChart from "@/components/ui/ApexChart";
import Link from "next/link";



export default function DashboardPage() {
  const { users, customers, karigars, items, orders } = useAppData();

  const ordersDataByDate = orders.reduce((acc, order) => {
    const d = order.date;
    if (d) {
      if (!acc[d]) acc[d] = { count: 0, grossWeight: 0 };
      acc[d].count++;
      acc[d].grossWeight += Number(order.gWt || 0);
    }
    return acc;
  }, {} as Record<string, { count: number; grossWeight: number }>);

  const sortedDates = Object.keys(ordersDataByDate).sort((a, b) => {
    const [d1, m1, y1] = a.split('-');
    const [d2, m2, y2] = b.split('-');
    return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
  });

  const series = [
    {
      name: 'Orders Count',
      type: 'line',
      data: sortedDates.map(date => ordersDataByDate[date].count)
    },
    {
      name: 'Gross Weight',
      type: 'line',
      data: sortedDates.map(date => ordersDataByDate[date].grossWeight)
    }
  ];

  const chartOptions: any = {
    chart: {
      type: 'line',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: { enabled: true }
    },
    colors: ['#0ea5e9', '#10b981'],
    stroke: {
      width: [4, 4],
      curve: 'smooth'
    },
    markers: {
      size: 6,
      colors: ['#0ea5e9', '#10b981'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 8 }
    },
    xaxis: {
      type: 'datetime',
      categories: sortedDates.map(d => {
        const [day, month, year] = d.split('-');
        return `${year}-${month}-${day}`; // Formatting to match screenshot
      }),
      title: {
        text: 'Date',
        style: { fontWeight: 700, fontSize: '14px', color: '#111827' }
      },
      labels: {
        rotate: -45,
      }
    },
    yaxis: [
      {
        title: {
          text: "Orders Count",
          style: { fontWeight: 700, fontSize: '14px', color: '#374151' }
        },
        labels: { formatter: (value: number) => value.toFixed(0) }
      },
      {
        opposite: true,
        title: {
          text: "Gross Weight",
          style: { fontWeight: 700, fontSize: '14px', color: '#374151' }
        },
        labels: { formatter: (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) }
      }
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 4,
    }
  };

  const orderConfirmedCount = orders.filter(o => o.status === "Order Confirmed").length;
  const assignedCount = orders.filter(o => o.status === "Assign Karigar" || o.status === "Assigned Karigar").length;
  const receivedCount = orders.filter(o => o.status === "Received from Karigar").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

  const pieData = [
    { name: 'Delivered', value: deliveredCount, color: '#14b8a6' },
    { name: 'Assigned', value: assignedCount, color: '#8b5cf6' },
    { name: 'Cancelled', value: cancelledCount, color: '#f43f5e' },
  ].filter(d => d.value > 0); // Recharts pie might be empty if all 0, which is fine

  const upcomingDeliveries = orders
    .filter(order => {
      if (order.status === "Delivered" || order.status === "Cancelled") return false;
      if (!order.deliveryDate) return false;
      const delivery = new Date(order.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      delivery.setHours(0, 0, 0, 0);
      const diffTime = delivery.getTime() - today.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return days <= 2; // Includes today, tomorrow, day after tomorrow, and overdue
    })
    .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="New Users" value={users.length} icon={UserPlus} delay={0.1} />
        <StatCard title="Customers" value={customers.length} icon={Users} delay={0.15} />
        <StatCard title="Karigar" value={karigars.length} icon={HardHat} delay={0.2} />
        <StatCard title="Items" value={items.length} icon={Package} delay={0.25} />
        <StatCard title="Orders" value={orders.length} icon={ShoppingCart} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link href="/dashboard/order-master?status=Order%20Confirmed">
          <StatCard title="Order Confirm" value={orderConfirmedCount} icon={CheckCircle2} delay={0.35} layout="horizontal" className="h-full cursor-pointer" />
        </Link>
        <Link href="/dashboard/order-master?status=Assigned%20Karigar">
          <StatCard title="Assign Karigar" value={assignedCount} icon={UserCog} delay={0.4} layout="horizontal" className="h-full cursor-pointer" />
        </Link>
        <Link href="/dashboard/order-master?status=Received%20from%20Karigar">
          <StatCard title="Receive Karigar" value={receivedCount} icon={UserCheck} delay={0.45} layout="horizontal" className="h-full cursor-pointer" />
        </Link>
        <Link href="/dashboard/order-master?status=Delivered">
          <StatCard title="Deliver Customer" value={deliveredCount} icon={Truck} delay={0.5} layout="horizontal" className="h-full cursor-pointer" />
        </Link>
        <Link href="/dashboard/order-master?status=Cancelled">
          <StatCard title="Cancel Order" value={cancelledCount} icon={XCircle} delay={0.55} layout="horizontal" className="h-full cursor-pointer" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <ChartCard
          title="Orders Per Day"
          subtitle="Showing daily order volume and gross weight"
          className="lg:col-span-2"
          delay={0.6}
        >
          <div className="w-full h-full min-h-[300px]">
            <ApexChart options={chartOptions} series={series} type="line" height="100%" />
          </div>
        </ChartCard>

        <ChartCard
          title="Orders by Status"
          subtitle="Distribution of current orders"
          delay={0.7}
        >
          <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="absolute bottom-0 w-full flex justify-center gap-6 pb-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-500" />
          Upcoming Deliveries <span className="text-sm font-normal text-gray-500">(Next 2 Days or Overdue)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold border-b">Order No</th>
                <th className="px-4 py-3 font-semibold border-b">Customer</th>
                <th className="px-4 py-3 font-semibold border-b">Product</th>
                <th className="px-4 py-3 font-semibold border-b">Delivery Date</th>
                <th className="px-4 py-3 font-semibold border-b">Days Left</th>
                <th className="px-4 py-3 font-semibold border-b">Status</th>
                <th className="px-4 py-3 font-semibold border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No upcoming deliveries.</td>
                </tr>
              ) : (
                upcomingDeliveries.map((order) => {
                  const customer = customers.find(c => c.id === order.customerId);
                  const item = items.find(i => i.id === order.productId);
                  const delivery = new Date(order.deliveryDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  delivery.setHours(0, 0, 0, 0);
                  const days = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {order.orderNo || '-'}
                      </td>
                      <td className="px-4 py-3">{customer?.customerName || '-'}</td>
                      <td className="px-4 py-3">{item?.itemName || '-'}</td>
                      <td className="px-4 py-3">{order.deliveryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${days < 0 ? 'bg-red-100 text-red-800 border-red-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                          {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Today' : `${days} day${days > 1 ? 's' : ''}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-800 border border-black/10">
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/dashboard/order-master/edit/${order.id}`} className={`inline-flex items-center justify-center p-1.5 rounded-md hover:bg-black/5 transition-colors ${days < 0 ? 'text-red-700' : 'text-orange-700'}`} title="Edit Order">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
