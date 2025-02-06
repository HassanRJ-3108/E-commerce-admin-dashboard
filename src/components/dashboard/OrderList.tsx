"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import type { Order } from "@/types/Order"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await client.fetch('*[_type == "order"] | order(createdAt desc)')
        setOrders(result)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setError("Failed to load orders. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.orderNumber || "N/A"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status || "Unknown"}
                </span>
              </TableCell>
              <TableCell>${order.totalAmount || "N/A"}</TableCell>
              <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell>
                <Link href={`/dashboard/orders/${order._id}`} passHref>
                  <Button as="a">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-200 text-yellow-800"
    case "processing":
      return "bg-blue-200 text-blue-800"
    case "shipped":
      return "bg-purple-200 text-purple-800"
    case "delivered":
      return "bg-green-200 text-green-800"
    case "cancelled":
      return "bg-red-200 text-red-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

