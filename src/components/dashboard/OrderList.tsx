"use client"

import { useState, useEffect } from "react"
import { client } from "@/sanity/lib/client"
import type { Order } from "@/types/Order"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await client.fetch('*[_type == "order"]')
      setOrders(result)
    }

    fetchOrders()
  }, [])

  const columns = [
    { header: "Order #", accessor: "orderNumber" as keyof Order },
    {
      header: "Status",
      accessor: "status" as keyof Order,
      cell: (order: Order) => (
        <Badge variant={order.status === "Completed" ? "secondary" : "default"}>{order.status}</Badge>
      ),
    },
    { header: "Total", accessor: "totalAmount" as keyof Order },
    {
      header: "Date",
      accessor: "createdAt" as keyof Order,
      cell: (order: Order) => new Date(order.createdAt).toLocaleDateString(),
    },
  ]

  return <DataTable data={orders} columns={columns} />
}

