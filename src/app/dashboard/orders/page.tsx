import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/DashboardShell"
import OrderList from "@/components/dashboard/OrderList"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your orders",
}

export default function OrdersPage() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <OrderList />
    </DashboardShell>
  )
}

